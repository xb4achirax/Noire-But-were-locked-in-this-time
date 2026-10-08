import jwt from 'jsonwebtoken';
import 'dotenv/config'

function requireAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Please sign-in first.' });
    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Session expired, please sign in again.' });
    }

}

export default { requireAuth }