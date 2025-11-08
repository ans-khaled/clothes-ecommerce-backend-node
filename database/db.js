const mongoose = require("mongoose");

const connectToDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((_) => {
      console.log("MongoDB is connected");
    })
    .catch((error) => {
      console.log("Error in connetion in DB", error);
    });
};

module.exports = connectToDB;
