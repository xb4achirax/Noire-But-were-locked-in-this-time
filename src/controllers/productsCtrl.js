import productsMdl from '../models/productsMdl.js';

async function GetAll(req, res) {
    const products = await productsMdl.GetAllProducts();
    // console.log(products)
    return res.render('products', { products })
}

async function ProductsWithGender(req, res, gender) {
    const products = await productsMdl.GetwithGender(gender);
    res.render('products', { products })
}

async function NewProducts(req, res) {
    const products = await productsMdl.GetNewProducts();
    res.render('products', { products })
}

async function ProductWithId(req, res) {
    const id = req.params.id;
    const product = await productsMdl.GetProductById(id);
    res.render('product', { product })
}
export default { GetAll, ProductsWithGender, NewProducts, ProductWithId }