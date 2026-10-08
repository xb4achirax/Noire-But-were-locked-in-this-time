import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport, { Passport } from "passport";
import 'dotenv/config';
import authCtrl from "../controllers/authCtrl.js";
import authMdl from "../models/authMdl.js";

passport.serializeUser((user, done) => {
    const userId = user;
    done(null, userId);
})

passport.deserializeUser(async (userId, done) => {
    try {
        const userArray = await authMdl.lookForProviderId(userId);
        if (!userArray || userArray.length === 0) {
        }
        const user = userArray[0];
        done(null, user);
    } catch (err) {
        console.error(err);
    }


})


const GoogleStrat = passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/redirect",
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            const user = {
                name: profile.displayName,
                email: profile.email,
                provider: profile.provider,
                provider_user_id: profile.id
            }
            const userId = await authCtrl.googleAccount(user);
            done(null, userId)
        } catch (err) {
            console.error(err)
        }

    }
));

export default GoogleStrat;


