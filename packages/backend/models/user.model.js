import process from 'node:process';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    match: /^\S[^\s@]*@\S[^\s.]*\.\S+$/,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  image: {
    type: String,
    default: null,
    trim: true
  },
  verified: {
    type: Boolean,
    default: true
  }
}, {timestamps: true});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, +process.env.SALT);
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const updatedData = this.getUpdate();
  if (updatedData.password) updatedData.password = await bcrypt.hash(updatedData.password, +process.env.SALT);
  this.setUpdate(updatedData);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, {_id, name, email, role, image}) => ({_id, name, email, role, image})
});

const User = mongoose.model('User', userSchema);
export default User;
