require('dotenv').config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000
app.use(
  cors({
    origin: [
      "https://shop-ease-9.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, 
      httpOnly: true,
      secure: false
    }
  })
);

app.use('/orders', orderRoutes);
app.use(userRoutes);
app.use(authRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MONGOOSE CONNECTED");

    app.listen(PORT, () => {
      console.log("server listens on port 3000");
    });
  })
  .catch((e) => {
    console.log("There is an error while connecting to mongodb", e);
  });
