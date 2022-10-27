import ItemModel from '../models/Item.js';
import CollectionModel from '../models/Collection.js';
import UserModel from '../models/User.js';

export const createItem = async (req, res) => {
	try {
		const collection = await CollectionModel.findOne({ _id: req.params.id });
		const user = await UserModel.findOne({ _id: req.userId });

		const doc = new ItemModel({
			collectionId: req.params.id,
			collectionName: collection.title,
			fields: req.body.data,
			additionalFields: req.body.additionalFields,
			user: req.userId,
			userName: user.fullName,
		});
		const item = await doc.save();
		await CollectionModel.updateOne(
			{ _id: req.params.id },
			{ $push: { countItems: item._id } }
		);

		res.json(item);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to create collection item',
		});
	}
};

export const getAllItemsById = async (req, res) => {
	try {
		const items = await ItemModel.find({ collectionId: req.params.id });
		res.json(items);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to get items',
		});
	}
};

export const getAllItems = async (req, res) => {
	try {
		const items = await ItemModel.find().sort({ createdAt: -1 });
		res.json(items);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to get items',
		});
	}
};

export const removeItem = async (req, res) => {
	try {
		const item = await ItemModel.findById({ _id: req.params.id });

		await CollectionModel.updateOne(
			{
				_id: item.collectionId,
			},
			{ $pull: { countItems: item._id } }
		);

		ItemModel.findByIdAndDelete({ _id: req.params.id }, (err, doc) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ message: 'Failed to delete item' });
			}
			if (!doc) {
				return res.status(404).json({ message: 'Item not found' });
			}
		});

		res.json({ message: 'Item deleted' });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to delete item',
		});
	}
};
export const upDateItem = async (req, res) => {
	try {
		const { data, additionalFields } = req.body;

		await ItemModel.updateOne(
			{ _id: req.params.id },
			{ fields: data, additionalFields: additionalFields }
		);

		res.json({ message: 'Item updated' });
	} catch (error) {
		res.status(500).json({
			message: 'Failed to update the item',
		});
	}
};

export const getOneItem = async (req, res) => {
	try {
		const item = await ItemModel.findOne({ _id: req.params.id });
		res.json(item);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to add comment',
		});
	}
};

export const toggleLike = async (req, res) => {
	try {
		const { id } = req.params;
		const item = await ItemModel.findOne({ _id: id });

		if (!item.likes.includes(req.userId)) {
			item.likes.push(req.userId);
		} else {
			const index = item.likes.findIndex(like => like === req.userId);
			item.likes.splice(index, 1);
		}

		await item.save();

		res.json(item);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to toggle like',
		});
	}
};
