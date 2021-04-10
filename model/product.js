const getDb=require('../util/database').getDb;
const mongodb=require('mongodb');

class Product{
    constructor(title,imageUrl,price,description,_id,userId){

        this.title=title;
        this.imageUrl=imageUrl;
        this.price=price;
        this.description=description;
        this._id=_id ? new mongodb.ObjectID(_id):null;
        this.userId=userId;
    }

    save()
    {
        const db=getDb();
        
        let dbOp;
        if(this._id){
                    dbOp=db.collection('products').updateOne({_id:this._id},{$set:this})
        }
        else{

            dbOp=db.collection('products').insertOne(this)
        }

        return dbOp
        .then((result) => {
           // console.log(result)
            
        }).catch((err) => {
            console.log(err);
        });

    }
    static fetchIndex(){
        const db=getDb();

        return db.collection('products').find()
        .toArray()
        .then(products=>{
            return products;
        })
        .catch(error=>{
        console.log(error);
        });
}
    static fetchAll(userId){
                            const db=getDb();

                            return db.collection('products').find({userId:new mongodb.ObjectID(userId)})
                            .toArray()
                            .then(products=>{
                                return products;
                            })
                            .catch(error=>{
                            console.log(error);
                            });
    }
    
    static findById(prodId){
        const db=getDb();

        return db.collection('products')
        .find({_id:new mongodb.ObjectId(prodId)})
        .next()
        .then(product=>{
            return product;
        })
        .catch(error=>{
            console.log(error)
        })



    }


    static deleteById(prodId){
        const db=getDb();
        return db.collection('products')
        .deleteOne({_id:new mongodb.ObjectID(prodId)})
        .then(result=>{
            //console.log(result)
        }
            )
        .catch(error=>{console.log(error)})
    }

    
}

module.exports= Product;