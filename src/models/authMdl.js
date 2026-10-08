import db from '../config/db.js';
import bcrypt from 'bcrypt';

async function lookForEmail(email) {
    const q = `SELECT * FROM utilisateur
                WHERE email = ?`;
    return new Promise((resolve, reject) => {
        db.query(q, [email], (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    })
}

async function lookForProviderId(id) {
    return new Promise(async (resolve, reject) => {
        const q = 'SELECT u.* FROM auth_provider a JOIN utilisateur u ON a.id_utilisateur = u.id WHERE a.provider_user_id = ?';
        db.query(q, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

async function createuser(name, email, password) {
    const hashedPass = await bcrypt.hash(password, 13);
    const IsExisting = await lookForEmail(email);

    if (IsExisting.length > 0) {
        throw new Error('User With This Email Already Exists.');
    }
    const q = 'INSERT INTO utilisateur(nom, email, password, role) VALUES (?, ?, ?, ?)';
    const DefaultRole = 'user';
    return new Promise(async (resolve, reject) => {
        await db.query(q, [name, email, hashedPass, DefaultRole], (err, result) => {
            if (err) return reject(err);
            return resolve(result.insertId);
        })
    })
}

async function authenticateuser(email, password) {
    const IsExisting = await lookForEmail(email);
    const user = IsExisting[0];
    if (!user) throw new Error('There is no user with this email');
    const dbPass = user.password;
    const IsMatch = await bcrypt.compare(password, dbPass);
    if (IsMatch) return user;
}

async function googleAccounthandling(user) {
    const defaultPasswrod = process.env.DUMMYPASSWORD;
    const ProviderAccount = await lookForProviderId(user.provider_user_id);
    if (ProviderAccount && ProviderAccount.length > 0) {
        return ProviderAccount[0];
    }

    const ExistingUser = await lookForEmail(user.email);

    const q = 'INSERT INTO auth_provider (id_utilisateur, provider, provider_user_id, email_provider) VALUES (?, ?, ?, ?)';

    if (ExistingUser.length === 0) {
        const userId = await createuser(user.name, user.email, defaultPasswrod);
        return new Promise((resolve, reject) => {
            db.query(q, [userId, user.provider, user.provider_user_id, user.email], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            })
        })
    } else {
        const userId = ExistingUser[0].id;
        return new Promise((resolve, reject) => {
            db.query(q, [userId, user.provider, user.provider_user_id, user.email], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            })
        })
    }
}

export default { createuser, authenticateuser, lookForProviderId, googleAccounthandling };