import CollectionModel from '../models/Collection.js';
import ItemModel from '../models/Item.js';
import UserModel from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';

export const createCollection = async (req, res) => {
	try {
		const { themeCollection, description, title, image, additionalFields } =
			req.body;

		let uploadedImage = '';

		if (image) {
			uploadedImage = await cloudinary.uploader.upload(image, {
				folder: 'collections',
			});
		}

		const user = await UserModel.findById(req.userId);

		const doc = await new CollectionModel({
			title: title,
			theme: themeCollection,
			description: description,
			imageUrl: uploadedImage.secure_url,
			user: req.userId,
			userName: user.fullName,
			additionalFields,
		});

		const collection = await doc.save();

		res.json(collection);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to create collection',
		});
	}
};

export const removeCollection = async (req, res) => {
	try {
		const id = req.params.id;
		const collection = await CollectionModel.findOne({ _id: id });

		collection.countItems.forEach(
			async item => await ItemModel.findByIdAndDelete({ _id: item })
		);

		CollectionModel.findByIdAndDelete({ _id: id }, (err, doc) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ message: 'Failed to delete collection' });
			}
			if (!doc) {
				return res.status(404).json({ message: 'Collection not found' });
			}
		});

		res.json({ message: 'Collection deleted' });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to delete collection',
		});
	}
};

export const getOneCollection = async (req, res) => {
	try {
		const id = req.params.id;
		const collection = await CollectionModel.findOne({ _id: id });

		res.json(collection);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to get collection',
		});
	}
};
export const getAllCollections = async (req, res) => {
	try {
		const collections = await CollectionModel.find();

		res.json(collections);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to get collections',
		});
	}
};

export const upDateCollection = async (req, res) => {
	try {
		const { themeCollection, description, title, image } = req.body;
		const id = req.params.id;

		let uploadedImage = '';

		if (image) {
			uploadedImage = await cloudinary.uploader.upload(image, {
				folder: 'collections',
			});
		}

		await CollectionModel.updateOne(
			{ _id: id },
			{
				title: title,
				theme: themeCollection,
				description: description,
				imageUrl: uploadedImage.secure_url || '',
			}
		);

		res.json({ message: 'Collection updated' });
	} catch (error) {
		res.status(500).json({
			message: 'Failed to update the collection',
		});
	}
};

export const fetchCollectionsById = async (req, res) => {
	try {
		const collections = await CollectionModel.find({ user: req.userId });
		res.json(collections);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Failed to get collections',
		});
	}
};
