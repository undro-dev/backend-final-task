import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from '../models/User.js';

const SECRET_KEY = process.env.SECRET_KEY;

export const register = async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			passwordHash: hash,
			isAdmin: req.body.email === 'igrok1261@gmail.com' ? true : false,
		});

		const user = await doc.save();

		const token = jwt.sign({ _id: user._id }, `${SECRET_KEY}`, {
			expiresIn: '30d',
		});

		const { passwordHash, ...userData } = user._doc;

		res.json({ ...userData, token });
	} catch (error) {
		res.status(500).json({
			message: 'Failed to register',
		});
	}
};

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({ message: 'User is not found' });
		}
		if (user.isBlock === true) {
			return res.status(404).json({ message: 'User is blocked' });
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		);

		if (!isValidPass) {
			return res.status(400).json({ message: 'Invalid login or password' });
		}

		const token = jwt.sign({ _id: user._id }, `${SECRET_KEY}`, {
			expiresIn: '30d',
		});

		const { passwordHash, ...userData } = user._doc;
		res.json({ ...userData, token });
	} catch (error) {
		res.status(500).json({
			message: 'Failed to login',
		});
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);

		if (!user) {
			return res.status(404).json({ message: 'User is not found' });
		}

		const { passwordHash, ...userData } = user._doc;
		return res.json(userData);
	} catch (error) {
		res.status(404).json({ message: 'User is not found' });
	}
};
export const getUsers = async (req, res) => {
	try {
		const users = await UserModel.find();

		if (!users) {
			return res.status(404).json({ message: 'Users is not found' });
		}
		return res.json(users);
	} catch (error) {
		res.status(404).json({ message: 'Users is not found' });
	}
};
export const removeUser = async (req, res) => {
	try {
		await UserModel.findByIdAndDelete({ _id: req.body.id });
		return res.json({ massage: 'Users is deleted' });
	} catch (error) {
		res.status(404).json({ message: 'Users is not found' });
	}
};
export const toggleBlockUser = async (req, res) => {
	try {
		const user = await UserModel.findById({ _id: req.body.id });
		await UserModel.findByIdAndUpdate(
			{ _id: req.body.id },
			{ isBlock: !user.isBlock }
		);

		return res.json({ massage: 'Successful' });
	} catch (error) {
		res.status(404).json({ message: 'Users is not found' });
	}
};
export const toggleAdminUser = async (req, res) => {
	try {
		const user = await UserModel.findById({ _id: req.body.id });
		await UserModel.findByIdAndUpdate(
			{ _id: req.body.id },
			{ isAdmin: !user.isAdmin }
		);

		return res.json({ massage: 'Successful' });
	} catch (error) {
		res.status(404).json({ message: 'Users is not found' });
	}
};
