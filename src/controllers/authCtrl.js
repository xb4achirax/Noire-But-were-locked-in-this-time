import authModel from '../models/authMdl.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import authMdl from '../models/authMdl.js';

async function CreateUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: 'Please enter all the fields in order for the account to be created.' })
    try {
        const user = await authModel.createuser(name, email, password);
        return res.status(201).json({ message: `The user was created successfully, Taking you to the sign-up.` });
    } catch (err) {
        console.error('The auth controller catch ERROR', err)
        return res.status(500).json({ error: err.message || 'Server error' });
    }
}

async function AuthencticateUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json('Please enter all the mandatory fields in order to sign-in.');
    try {
        const user = await authModel.authenticateuser(email, password);
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_EXPIRES_IN }
        );
        res.cookie('token', token, {
            httpOnly: true,                                  // JS in the browser can't read it (blocks XSS theft)
            secure: process.env.NODE_ENV === 'production',   // HTTPS only in production
            sameSite: 'lax',                                 // basic CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json({ message: 'The user was signed in seccessffuly.' })
    } catch (err) {
        if (err.status === 401) return res.status(401).json({ message: err.message });
        console.error('authenticateUser controller error:', err);
        return res.status(500).json({ message: 'Server error, please try again later.' });
    }

}

async function googleAccount(user) {
    await authMdl.googleAccounthandling(user);

    return user.provider_user_id;
}


export default { CreateUser, AuthencticateUser, googleAccount };