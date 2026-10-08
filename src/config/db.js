import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'noire',
    port: '3306'
});

db.connect((err) => {
    if (err) return console.log('❗  There was an error while connecting to the database ❗.')
    return console.log('🟢 The connection to the database was created successfuly 🟢.')
})

export default db;