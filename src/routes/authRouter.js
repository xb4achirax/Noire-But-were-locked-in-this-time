import express from 'express';
import authCtrl from '../controllers/authCtrl.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/sign-up', (req, res) => {
    authCtrl.CreateUser(req, res);
})

router.post('/sign-in', (req, res) => {
    authCtrl.AuthencticateUser(req, res);
})

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}))

router.get('/google/redirect', passport.authenticate('google', {
    failureRedirect: '/auth/google/failure',
    successRedirect: '/auth/google/success'
}))
router.get('/google/success', (req, res) => {
    const user = req.user;
    // console.log(user)
    const token = jwt.sign({
        id: user.id,
        role: user.role
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_EXPIRES_IN })
    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }).redirect('/?notify=google_success')

})

router.get('/logout', (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/?notify=logged_out');
    });
});


export default router;