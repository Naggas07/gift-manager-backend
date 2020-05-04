const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");
const SALTFACTOR = 10;
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: [EMAIL_PATTERN, "el email debe tener un formato válido"],
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    userType: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

//configs
userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt
      .genSalt(SALTFACTOR)
      .then((salt) => {
        return bcrypt.hash(user.password, salt).then((hash) => {
          user.password = hash;
          next();
        });
      })
      .catch(next);
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

//virtuals

const User = mongoose.model("User", userSchema);

module.exports = User;
