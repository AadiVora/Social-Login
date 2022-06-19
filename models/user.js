const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/sociallogin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    pic: String
});

module.exports = mongoose.model('User', userSchema);
