const mongodb=require('mongodb');

const MongoClient= mongodb.MongoClient;
let _db;




const mongoConnect=callback=>{

    MongoClient.connect('mongodb+srv://chirag:Chirag@cluster0-wufjm.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(client=>{
        console.log('connected');
        _db=client.db();
        callback();

    })
    .catch(error=>{

        console.log(error);
    })
}

const getDb=()=>{

    if(_db){
        return _db;
    }
    else{
        throw 'Database No found'
    }

}


exports.mongoConnect=mongoConnect;
exports.getDb=getDb;