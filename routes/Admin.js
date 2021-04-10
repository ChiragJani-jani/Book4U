const express=require('express');

const AdminData=require('../controller/AdminData');
const isAuth=require('../middleware/is-auth')

const bodyParser=require('body-parser')


var urlencodedParser=bodyParser.urlencoded({extended:false})

const router=express.Router();

router.get('/add-product',isAuth,AdminData.getAddProduct);
router.post('/add-product',urlencodedParser,isAuth,AdminData.postAddProduct)

router.get('/products',isAuth,AdminData.getDetail);

router.get('/edit-product/:prodId',isAuth,AdminData.getEditProduct);

router.post('/edit-product',urlencodedParser,isAuth,AdminData.postEditProduct)

router.delete('/delete-product/:productId',urlencodedParser,isAuth,AdminData.deleteProduct);


module.exports = router;