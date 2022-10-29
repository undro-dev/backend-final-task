import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		collections: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isBlock: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('User', UserSchema);
