const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectToDB = require("./database/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const contactRoutes = require("./routes/contactRoutes");
const faqRoutes = require("./routes/faqRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectToDB();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoutes);

app.use("/api/users", userRoutes);

app.use("/api/category", categoryRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/faq", faqRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
