// import mongoose package
const mongoose = require("mongoose");

// create a schema variable = to mongoose schema class, where you can make the model/schema document object
const schema = mongoose.Schema({
  username: String,
  email: String,
});

// export the schema model by naming the schema and attaching the schema variable
module.exports = mongoose.model("User", schema);
