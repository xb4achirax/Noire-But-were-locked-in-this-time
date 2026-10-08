import express from 'express';
import productsCtrl from '../controllers/productsCtrl.js';

const Router = express.Router();

Router.get('/', (req, res) => {
    productsCtrl.GetAll(req, res)
})

Router.get('/new-arrivals', (req, res) => {
    productsCtrl.NewProducts(req, res)
})

Router.get('/product/:id', (req, res) => {
    productsCtrl.ProductWithId(req, res)
})

Router.get('/:gender', (req, res) => {
    let gender = req.params.gender;
    if (gender === 'men') {
        gender = 'male';
    }
    productsCtrl.ProductsWithGender(req, res, gender);

})
export default Router;