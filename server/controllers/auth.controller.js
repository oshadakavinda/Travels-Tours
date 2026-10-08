import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";


import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (
    !username ||
    !email ||
    !password || 
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new user instance
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // Save the new user to the database
    await newUser.save();

    // Send a success response
    return res.json({ message: "Signup successful" });
  } catch (error) {
    // Handle errors and send an error response
    next(error);
  }
};

export const SignIn = async (req, res, next) => {
  const { email,password } = req.body;

  if(!email || !password || email === ''|| password === '')
    {
      next(errorHandler(400),'All fields are required');
  }
  try {
    const validUser = await User.findOne({ email});
    if(!validUser)
      {
        return  next(errorHandler(404,'User not found'));
      }
    const validPassword = bcryptjs.compareSync(password,validUser.password); 
    if(!validPassword)
    {
          return  next(errorHandler(400,'Password incorrect'));
        }
        const token = jwt.sign(
          { id:validUser._id, isAdmin:validUser.isAdmin}, process.env.JWT_SECRET_KEY);

          const { password : pass, ...rest} = validUser._doc;
        
        res.status(200).cookie('access_token',token, {
         httpOnly: true}).json(rest);

  } catch (error) {
    next(error);
  }
};

export const Google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
      const user = await User.findOne({ email });
      if (user) {
          // Update profile picture if it exists in the request
          if (googlePhotoUrl) {
              user.profilePicture = googlePhotoUrl;
              await user.save();
          }

          // existing user found, send response...
          const token = jwt.sign({ id: user._id, isAdmin:user.isAdmin }, process.env.JWT_SECRET_KEY);
          const { password, ...rest } = user._doc;
          res.status(200).cookie('access_token', token, {
              httpOnly: true,
          }).json(rest);
      } else {
          // new user, create a new entry
          const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
          const newUser = new User({
              username: name.toLowerCase().replace(/\s/g, '') + Math.random().toString(9).slice(-4),
              email,
              password: hashedPassword,
              profilePicture: googlePhotoUrl,
          });
          await newUser.save();
          const token = jwt.sign({ id: newUser._id, isAdmin:newUser.isAdmin }, process.env.JWT_SECRET_KEY);
          const { password, ...rest } = newUser._doc;
          res.status(200).cookie('access_token', token, {
              httpOnly: true,
          }).json(rest);
      }
  } catch (error) {
      next(error);
  }
};
