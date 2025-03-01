import {createUserValidation, updateUserValidation} from 'shared';
import User from '../models/user.model.js';

export const createUser = async (req, res) => { // for test until we have register
  try {
    await createUserValidation.parseAsync(req.body);
    const user = await User.create(req.body);
    res.status(201).json({status: 'success', data: user});
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
      res.status(409).json({status: 'fail', message: 'Email already exists'});
    } else {
      res.status(422).json({status: 'fail', message: err.errors || err.message});
    }
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    await updateUserValidation.parseAsync(req.body);
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json({status: 'success', data: updatedUser});
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
      res.status(409).json({status: 'fail', message: 'Email already exists'});
    } else {
      res.status(422).json({status: 'fail', message: err.errors || err.message});
    }
  }
};

export const updateUserImage = async (req, res) => {
  const id = req.params.id;
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ status: 'fail', message: 'No image uploaded' });
    }

    const user = await User.findByIdAndUpdate(id, { image: req.file.path }, {new: true});
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message });
  }
};
