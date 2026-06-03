
exports.welcomeTemplate = (name) => {
  return `
   <div style = "font-family:Arial,sans-serif;background:#f4f7fb;padding:40px" >
    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden">

      <div style="background:linear-gradient(135deg,#06b6d4,#2563eb);padding:30px;text-align:center">
        <h1 style="color:white;margin:0">
          Welcome to ShopEase 🎉
        </h1>
      </div>

      <div style="padding:40px">

        <h2>Hello ${name},</h2>

        <p>
          Your account has been created successfully.
        </p>

        <p>
          Start exploring amazing products and enjoy seamless shopping.
        </p>

        <div style="margin-top:30px;text-align:center">
          <a href="https://shopease.com"
            style="
               background:#2563eb;
               color:white;
               text-decoration:none;
               padding:12px 24px;
               border-radius:8px;
               display:inline-block;
             ">
            Start Shopping
          </a>
        </div>

      </div>

    </div>

  </div>
  `;
};
