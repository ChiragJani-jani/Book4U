const Product=require('../model/product');




exports.getAddProduct=  (req,res,next)=>{
   // isLoggedIn=req.get('Cookie').split('=')[1] ==='true'
    res.render('admin/edit-product', {
        
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
       

   })

}

exports.postAddProduct=(req,res,next)=>{

            const title=req.body.title;
            const imageUrl=req.body.imageUrl;
            const price=req.body.price;
            const description=req.body.description;

            const product= new Product(title,imageUrl,price,description,null,req.user._id);

            product.save()
            .then(result=>{
                
                res.redirect('/admin/add-product')
            })
            .catch(error=>{
                console.log(error);
            })

}

exports.getDetail=(req,res,next)=>{
    // isLoggedIn=req.get('Cookie').split('=')[1] ==='true'
    userId=req.user._id
    //console.log(userId)

    Product.fetchAll(userId).then(products=>{

        res.render('admin/products',{

            path:'/admin/products',
            pageTitle:"Admin Product",
            prods:products,
       

        })
    }).catch(error=>{
        console.log(error);
    })

}

exports.getEditProduct=(req,res,next)=>{

    // isLoggedIn=req.get('Cookie').split('=')[1] ==='true'
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }

    const prodId=req.params.prodId;

    Product.findById(prodId).then(product=>{

        res.render('admin/edit-product',{
                pageTitle:'Edit-product',
                path:'/admin/edit-product',
                editing:editMode,
                product:product,
              

        })
    })
}

exports.postEditProduct=(req,res,next)=>{
    // isLoggedIn=req.get('Cookie').split('=')[1] ==='true'

                                            const updatedTitle=req.body.title;
                                            const updatedImageUrl=req.body.imageUrl;
                                            const updatedPrice=req.body.price;
                                            const updatedDesc=req.body.description;
                                            const _id=req.body.productId;

                                        const product= new Product(updatedTitle,updatedImageUrl,updatedPrice,updatedDesc,_id,req.user._id);
                                        product.save().then(result=>{
                                            res.redirect('/admin/products')
                                            
                                        })
                                        .catch(error=>{console.log(error)})

}

exports.deleteProduct=(req,res,next)=>{
    const prodId=req.params.productId;

    Product.deleteById(prodId)
    .then(result=>{
        res.status(200).json({
            message:"successful"
        })
        console.log(result)
    })
    .catch(error=>{
        console.log(error)
    })
}