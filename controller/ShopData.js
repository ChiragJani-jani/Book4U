const Product=require('../model/product'); 
const stripe = require('stripe')('sk_test_51H97ulLulpR9AtFYXJsg9TVqozkAlkqsxDqctganrfi7OuFL6sHVg3qSWcmT0QwAIC5R7MAM58lHv1S9hvETj8pF00Ud9MazRF');


exports.getIndex=(req,res,next)=>{
    

   Product.fetchIndex().then(products=>{
    // isLoggedIn=req.get('Cookie').split('=')[1] ==='true'
    res.render('shop/index',{
        prods:products,
        path:'/',
        pageTitle:'Shop',
        
     
    })

   })
   .catch(error=>{
       console.log(error)
   })


    
}

exports.getProduct=(req,res,next)=>{
    const prodId=req.params.productId;
    // isLoggedIn=req.get('Cookie').split('=')[1] ==='true'
    Product.findById(prodId)
    .then(product=>{
        const product1=[product];
        console.log(product)
        res.render('shop/product-detail',{
            path:"/products",
            pageTitle:'Product',
            prods:product1,
         
        })
    })
    .catch(error=>{
        console.log(error)
    })
}

exports.postAddProduct=(req,res,next)=>{

    const prodId=req.body.productId;

    Product.findById(prodId)
    .then(product=>{
      return  req.user.addToCart(product)
    }).then(result=>
        {
            //console.log(result)
            res.redirect('/cart')
        }
    )
    .catch(err=>{console.log(err)})


}

exports.getCart=(req,res,next)=>{
    // isLoggedIn=req.get('Cookie').split('=')[1] ==='true'
    req.user.getCart()
    .then(products=>{
        res.render('shop/cart',{
            path:'/cart',
            pageTitle:'Your Cart',
            products:products,
           
        })
        
        }).catch(err=>{
            console.log(err)
        })
    
}

exports.postCartDeleteProduct=(req,res,next)=>{
    
    const prodId=req.body.productId;
    req.user. deleteItemFromCart(prodId).then(result=>{
        res.redirect('/')
        //console.log(result)
    })
    .catch(err=>{
        console.log(err)
    })
}
exports.postOrder=(req,res,next)=>{
    const token = req.body.stripeToken;
    let total=0;
    const card = req.body.cardToken;
    console.log(card)
    req.user.getCart()
    .then(products=>{
       
        products.forEach(p=>{
            total+=p.quantity*p.price
        })
        })
        .catch(err=>{
            console.log(err)
        })



    req.user.addOrder()
    .then(result=>{
        // Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys

const customer = stripe.customers.create({
    name: 'Jenny Rosen',
    address: {
      line1: '510 Townsend St',
      postal_code: '98140',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
    },
   

  }).then(ct=>{
    //    console.log(ct)

       const charge = stripe.charges.create({
        customer:ct.id, 
        description: 'Software development services',
        shipping: {
        name: 'Jenny Rosen',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        },
      },
      amount: total,
      currency: 'usd',
    //   payment_method_types: ['card'],
   
     
    })
    .then(result=>{
       console.log(result)
       res.redirect('/orders') 
    }).catch(err=>{
        console.log(err)
    })
    
   
  }).catch(err=>{
      console.log(err)
  });
 
 
        //console.log(result)
     
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.getOrder=(req,res,next)=>{
    isLoggedIn=req.get('Cookie').split('=')[1] ==='true'
    req.user.getOrders().then(orders=>{
        res.render('shop/orders',{
            path:'/orders',
            pageTitle:'Your order',
            orders:orders,
          
        })
    })
}

exports.getCheckout=(req,res,next)=>{

    req.user.getCart()
    .then(products=>{
        let total=0;
        products.forEach(p=>{
            total+=p.quantity*p.price
        })

        res.render('shop/checkout',{
            path:'/checkout',
            pageTitle:'Your Order',
            products:products,
            TotalSum:total,
           
        })
        })
        .catch(err=>{
            console.log(err)
        })

  
}



exports.getProducts=(req,res,next)=>{

    Product.fetchIndex().then(products=>{
        
     // isLoggedIn=req.get('Cookie').split('=')[1] ==='true'
     res.render('shop/product-detail',{
         prods:products,
         path:'/products',
         pageTitle:'All Products',
         
      
     })
 
    })
    .catch(error=>{
        console.log(error)
    }) 
     
 }

