const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
  const user = await User.create({...req.body})
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user : {
      lastName : user.lastName,
      name : user.name,
      location : user.location,
      email : user.email,
      token
    }
  })
}

const login = async (req, res) => {
  const {email, password} = req.body;
  if(!email || !password){
    throw new BadRequestError("Please provide both values")
  };
  const user = await User.findOne({email});
  if(!user){
    throw new UnauthenticatedError('User does not exist')
  }
  const isPasswordCorrect = user.comparePassword(password);
  if(!isPasswordCorrect){
    throw new UnauthenticatedError("Password does not match")
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user : {
      lastName : user.lastName,
      name : user.name,
      location : user.location,
      email : user.email,
      token
    }
  })

}

const updateUser = async(req, res) => {
  const {email, name, location, lastName} = req.body;
  if(!name || !email || !location || !lastName){
    throw new BadRequestError("Please provide all values")
  }
  const user = await User.findOne({_id : req.user.userId});

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;
  console.log(user.lastName);
  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: {
    email : user.email,
    name : user.name,
    lastName : user.lastName,
    location : user.location,
    token
  }
})


}

module.exports = {
  register,
  login,
  updateUser
}
