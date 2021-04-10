const express = require('express');

const ShopData=require('../controller/ShopData')

const isAuth=require('../middleware/is-auth')
const bodyParser=require('body-parser')
var urlencodedParser=bodyParser.urlencoded({extended:false})


const router=express.Router();

router.get('/',ShopData.getIndex);

router.get('/products/:productId', ShopData.getProduct);

router.post('/cart',urlencodedParser,isAuth,ShopData.postAddProduct);

router.get('/cart',isAuth,ShopData.getCart)

router.post('/cart-delete-item',urlencodedParser,isAuth,ShopData.postCartDeleteProduct)


router.get('/orders',isAuth,ShopData.getOrder);

router.get('/products',ShopData.getProducts);
router.get('/checkout',ShopData.getCheckout);



module.exports=router;