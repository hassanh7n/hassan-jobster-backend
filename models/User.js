const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserShcema = new mongoose.Schema({
  name : {
      type : String,
      required : [true, 'Please provide your name'],
      maxlength : 50,
      minlength : 3,
  },
  email : {
      type : String,
      required : [true, "Please provide email address"],
      match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please provide a valid email',
      ],
      unique: true,
  },
  password : {
      type : String,
      required : [true, 'please provide password'],
      minlength : [6, 'password must contain more than 6 characters']
  },
  lastName : {
    type : String,
    default : 'lastName',
    maxlength : 20,
    trim : true
},
  location : {
      type : String,
      default : 'myCity',
      maxlength : 20,
      trim : true
  }
})



UserShcema.pre('save', async function() {
  if(!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); 
});

UserShcema.methods.createJWT = function () {
  return jwt.sign(
      {userId : this._id, name : this.name},
      process.env.JWT_SECRET,
      {
          expiresIn : process.env.JWT_LIFETIME,
      }
  );
};


UserShcema.methods.comparePassword = async function(candidatePassword) {
const isMatch = await bcrypt.compare(candidatePassword, this.password);
return isMatch;
}

module.exports = mongoose.model('User', UserShcema)
