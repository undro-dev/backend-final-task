import { body } from 'express-validator';

export const registerValidation = [
	body('email', 'Invalid email').isEmail(),
	body('password', 'Еhe password is short').isLength({ min: 5 }),
	body('fullName', 'Enter your name').isLength({ min: 3 }),
];
export const loginValidation = [
	body('email', 'Invalid email').isEmail(),
	body('password', 'The password is short').isLength({ min: 5 }),
];
export const itemsCreateValidation = [
	body('theme', 'Choose a collection theme').isString(),
	body('title', 'Enter the title').isLength({ min: 3 }).isString(),
	body('text', 'Enter text').isLength({ min: 3 }).isString(),
	body('tags', 'Invalid tag format').optional().isString(),
	body('imageUrl', 'Invalid image link').optional().isString(),
];

export const collectionCreateValidation = [
	body('themeCollection', 'Choose a collection theme').isString(),
	body('title', 'Enter the title').isLength({ min: 3 }).isString(),
	body('description', 'Enter description').isLength({ min: 5 }).isString(),
];
