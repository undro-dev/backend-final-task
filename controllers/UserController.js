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
