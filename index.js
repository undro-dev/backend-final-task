import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import {
	registerValidation,
	loginValidation,
	collectionCreateValidation,
} from './validations/validations.js';

import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';
import {
	createCollection,
	fetchCollectionsById,
	removeCollection,
	getOneCollection,
	upDateCollection,
	getAllCollections,
} from './controllers/CollectionController.js';
import {
	createItem,
	getAllItemsById,
	removeItem,
	upDateItem,
	getOneItem,
	toggleLike,
	getAllItems,
} from './controllers/ItemsController.js';

import {
	create,
	getAllCommentsById,
} from './controllers/CommentsController.js';

const PORT = process.env.PORT;

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB is OK'))
	.catch(() => console.log('DB error'));

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

//auth
app.post('/auth/login', loginValidation, login);
app.post('/auth/register', registerValidation, register);
app.get('/auth/me', checkAuth, getMe);

//collection
app.post(
	'/collection',
	checkAuth,
	collectionCreateValidation,
	createCollection
);
app.patch('/collection/:id', checkAuth, upDateCollection);
//Collections
app.get('/collections', checkAuth, getAllCollections);
app.get('/my-collections', checkAuth, fetchCollectionsById);
app.get('/my-collections/:id', checkAuth, getOneCollection);
app.delete('/my-collections/:id', checkAuth, removeCollection);

//items
app.post('/my-collections/:id', checkAuth, createItem);
app.get('/my-collections/items/:id', checkAuth, getAllItemsById);
app.get('/items', checkAuth, getAllItems);

app.delete('/items/:id', checkAuth, removeItem);
app.patch('/items/:id', checkAuth, upDateItem);
app.get('/items/:id', checkAuth, getOneItem);
app.post('/items/:id/like', checkAuth, toggleLike);

//Comments
app.post('/items/:id', checkAuth, create);
app.get('/items/:id/comments', checkAuth, getAllCommentsById);

app.listen(PORT, err =>
	err ? console.log(err) : console.log(`Server started on ${PORT}`)
);
