import mongoose from 'mongoose';

const CommentsSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		itemId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Item',
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Comment', CommentsSchema);
