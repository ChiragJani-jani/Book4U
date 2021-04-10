const getDb = require('../util/database').getDb;
const mongodb=require('mongodb');
const Product=require('./product');

class  User{
              constructor(email,password,cart,_id,resetToken,resetExpiration ) {

               this.password=password
                this.email=email;
                this.cart=cart; //{item:[]}
                this._id=_id;
                this.resetToken=resetToken;

                this.resetExpiration=resetExpiration

                  
              }
            //   save(){
            //       const db=getDb();

            //        return db.collection('users').insertOne(this)
            //       .then(result=>{
            //           console.log(result)
            //       })
            //       .catch(error=>{
            //           console.log(error)
            //       }) 
            //   }
              addToCart(product){

                  const cartProductIndex=this.cart.item.findIndex(cp=>{
                      return cp.productId.toString()=== product._id.toString();
                  })

                  let  newQuantity =1;
                  const updateCartitems=[...this.cart.item]

                  if(cartProductIndex>=0){
                      newQuantity=this.cart.item[cartProductIndex].quantity+1;
                    updateCartitems[cartProductIndex].quantity=newQuantity;
                  }
                  else{
                      updateCartitems.push({
                          productId:new mongodb.ObjectID( product._id),
                          quantity:newQuantity
                      })
                  }

                const updatedCart={item:updateCartitems}

                const db=getDb()

                return db.collection('users')
                .updateOne({_id:new mongodb.ObjectID(this._id)}
                ,{$set:{cart:updatedCart}})

              }

        getCart(){

            const db=getDb();

            const productIds=this.cart.item.map(i=>{
                return i.productId;
            })
            
            return db.collection('products').find({_id:{$in:productIds}})
            .toArray()
            .then(products=>{
                return products.map(p=>{
                    return {...p,
                        quantity:
                                    this.cart.item.find(i=>{
                                        return i.productId.toString()===p._id.toString();
                                    }).quantity
                    
                    
                    }
                })
            })
            .catch(err=>{
                console.log(err)
            })


                }

                addOrder(){
                                const db=getDb();
                               return this.getCart().then(products=>{
                                    const order={
                                        item:products,
                                        user:{
                                            _id:new mongodb.ObjectID(this._id),
                                            email:this.email 
                                        }
                                    }
                                    return db.collection('orders')
                                    .insertOne(order)
                                }
                                )
                                   .then(result=>{
                                    console.log(result)
                                    this.cart={item:[]};

                                    return db.collection('users')
                .updateOne({_id:new mongodb.ObjectID(this._id)}
                ,{$set:{cart:{item:[]}}})

                                })
                }

                getOrders(){
                    const db=getDb()
                    return db.collection('orders').find({'user._id':new mongodb.ObjectID(this._id)})
                    .toArray()
                }


                deleteItemFromCart(prodId){
                    const updatedCartItems=this.cart.item.filter(item=>{
                        return item.productId.toString() !== prodId.toString();
                    })
                    const db=getDb();
                    return db.collection('users')
                    .updateOne({_id:new mongodb.ObjectID(this._id)},
                    {
                        $set:{cart:{item:updatedCartItems}}
                    }
                    )
                }



              static findById(userId)
              {
                  const db=getDb();

                  return db.collection('users')
                  .findOne({_id:new mongodb.ObjectID(userId)})
                  .then(user=>{
                      return user;
                  })
                  .catch(err=>{
                      console.log(err);
                  })
              }

              static findOne(email)
              {
                  const db=getDb();

                  return db.collection('users')
                  .findOne({email:email})
                  .then(user=>{
                      return user;
                  })
                  .catch(err=>{
                      console.log(err);
                  })
              }


              save()
              {
                  const db=getDb();
                  
                  let dbOp;
                  if(this._id){
                              dbOp=db.collection('users').updateOne({_id:this._id},{$set:this})
                  }
                  else{
          
                      dbOp=db.collection('users').insertOne(this)
                  }
          
                  return dbOp
                  .then((result) => {
                      console.log(result)
                      
                  }).catch((err) => {
                      console.log(err);
                  });
          
              }
  static findByToken(resetToken,curDate){
      const db=getDb();
      return db.collection('users')
      .findOne({resetToken:resetToken,resetExpiration:{$gt:curDate}})
      .then(user=>{
          return user
      })
      .catch(err=>{
          console.log(err)
      })
  }

  static findById_Token(UserId,token,curDate){
    const db=getDb();
    return db.collection('users')
    .findOne({resetToken:token, _id:new mongodb.ObjectID(UserId)  ,resetExpiration:{$gt:curDate}})
    .then(user=>{
        return user
    })
    .catch(err=>{
        console.log(err)
    })

  }



}


module.exports=User;