const User = require("../models/userModel");

exports.toggleFavourites = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check session user
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const userId = req.session.user._id;

    const user = await User.findById(userId);

    // Check database user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyFavourite = user.favourites.some(
      (fav) => fav.toString() === productId
    );

    if (alreadyFavourite) {
      user.favourites.pull(productId);
    } else {
      user.favourites.push(productId);
    }

    await user.save();

    req.session.user = user.toObject();

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session save failed",
        });
      }

      res.status(200).json({
        success: true,
        isFavourite: !alreadyFavourite,
        user: req.session.user,
        message: alreadyFavourite
          ? "Removed from favourites"
          : "Added to favourites",
      });
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFavourites = async(req,res)=>{
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }
  const userId  = req.session.user._id;
  const user = await User.findById(userId).populate('favourites')
  res.status(200).json({favourites:user.favourites})
}
exports.getCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const userId = req.session.user._id;

    // 1. Double check your userModel.js schema! 
    // If the field name is lowercase 'cart', change 'Cart' to 'cart' here and in toggleCart.
    const user = await User.findById(userId).populate('Cart');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Safe fallback: Send an empty array if user.Cart is somehow null or undefined
    res.status(200).json({
      cart: user.Cart || []
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error fetching cart items",
    });
  }
};


exports.toggleCart = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check session user
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const userId = req.session.user._id;

    const user = await User.findById(userId);

    // Check database user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const alreadyInCart = user.Cart.some(
      (cartId) => cartId.toString() === productId
    );

    if(alreadyInCart){
      user.Cart.pull(productId);
    }else{      
      user.Cart.push(productId);
    }

    await user.save();

    req.session.user = user.toObject();
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Session save failed",
        });
      }
      res.status(200).json({
        success: true,
        user: req.session.user,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ... (Keep your existing toggleFavourites, getFavourites, getCart, toggleCart) ...

exports.getAddresses = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Please login first" });
    }
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, addresses: user.address || [] });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: "Server error fetching addresses" });
  }
};

exports.addAddress = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Please login first" });
    }

    const { name, line1, line2, phone } = req.body;

    if (!name || !line1 || !line2 || !phone) {
      return res.status(400).json({ success: false, message: "All address fields are required." });
    }

    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Push the new address to the array
    user.address.push({ name, line1, line2, phone });
    await user.save();

    // Update session
    req.session.user = user.toObject();

    req.session.save((err) => {
      if (err) throw err;
      res.status(200).json({
        success: true,
        message: "Address added successfully",
        addresses: user.address
      });
    });

  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ... (Keep existing methods like getAddresses, addAddress, toggleCart, etc.)

exports.updateProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Please login first" });
    }

    // Explicitly destructure ONLY the fields we allow the user to change.
    // Notice `email` is NOT included here, making it impossible to update.
    const { firstName, lastName } = req.body;

    if (!firstName) {
      return res.status(400).json({ success: false, message: "First name is required." });
    }

    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Apply the updates
    user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;

    await user.save();

    // Update the session with the new user details
    req.session.user = user.toObject();

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Session save failed" });
      }
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: req.session.user
      });
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error while updating profile." });
  }
};