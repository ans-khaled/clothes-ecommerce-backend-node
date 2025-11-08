// Run in terminal first to create superAdmin once.

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const connectToDB = require("../database/db");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function createAdmin() {
  try {
    await connectToDB();

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      userName: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

createAdmin();
