import UserModel from '../models/User.js';
import CommentModel from '../models/Comments.js';

export const create = async (req, res) => {
	try {
		const user = await UserModel.findOne({ _id: req.userId });

		const doc = await new CommentModel({
			userId: req.userId,
			itemId: req.params.id,
			text: req.body.comment,
			userName: user.fullName,
		});

		const comment = await doc.save();

		res.json(comment);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to create comment',
		});
	}
};

export const getAllCommentsById = async (req, res) => {
	try {
		const { id } = req.params;
		const comments = await CommentModel.find({
			itemId: id,
		});

		res.json(comments);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to get comments',
		});
	}
};
