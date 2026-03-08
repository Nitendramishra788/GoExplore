const mongoose= require("mongoose");;
const passportLocalMongoose = require("passport-local-mongoose");
const plugin = passportLocalMongoose.default || passportLocalMongoose;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    role:{
        type:String,
        enum:["user" , "author"],
        default:"user"
    }
});

// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(plugin);


module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
  