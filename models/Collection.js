import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		theme: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			default: '',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		additionalFields: {
			type: Array,
			default: [],
		},
		countItems: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Collection', CollectionSchema);
