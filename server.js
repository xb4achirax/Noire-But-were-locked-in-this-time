import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './src/routes/productsRoute.js';
import authRouter from './src/routes/authRouter.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import session from 'express-session';
import productsMdl from './src/models/productsMdl.js';
import googleStrat from './src/config/GoogleSetup.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Passport session setup so we can serialize and deserialize users
app.use(session({
    secret: 'keycat',
    resave: false,
    saveUninitialized: false
}))

//This is needed to use the passport library
app.use(passport.initialize());
app.use(passport.session());



//cookie-Parser
app.use(cookieParser());

app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            res.locals.user = decoded;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

const port = process.env.PORT || 3001;

//Making the currnet file path and the directory path so we can access other folders like public and src.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//Setting the view engine and the views path so we can render ejs files.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

//Setting the public folder so the app can request the css files when needed.
app.use(express.static(path.join(__dirname, 'public')));





//Routes
app.use('/products', productsRouter);
app.use('/auth', authRouter)

app.get('/', async (req, res) => {
    try {
        const newDrops = await productsMdl.GetNewProducts();
        const allProducts = await productsMdl.GetAllProducts();
        res.render('home', { newDrops, allProducts })
    } catch (err) {
        console.error('Error loading home page:', err);
        res.render('home', { newDrops: [], allProducts: [] })
    }
})
app.get('/products', (req, res) => {
    res.render('products')
})


app.listen(port, () => {
    console.log(`🚀 Running on : http://localhost:${port}`)
})