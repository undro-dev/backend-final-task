import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
	{
		collectionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Collection',
			required: true,
		},
		collectionName: {
			type: String,
			required: true,
		},
		fields: {
			type: Object,
			default: {},
			required: true,
		},
		additionalFields: {
			type: Array,
			default: [],
		},
		likes: {
			type: Array,
			default: [],
			required: true,
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
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Item', ItemSchema);
