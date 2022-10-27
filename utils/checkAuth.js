import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export default (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

	if (token) {
		try {
			const decoded = jwt.verify(token, `${SECRET_KEY}`);
			req.userId = decoded._id;
			next();
		} catch (error) {
			return res.status(403).json({ message: 'No access' });
		}
	}
};
