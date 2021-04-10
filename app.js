const express=require('express');
const path=require('path');
var cookieParser = require('cookie-parser');
const sgMail = require('@sendgrid/mail')

var bodyParser = require('body-parser');
const session=require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);
const AdminRoutes=require('./routes/Admin');
const ShopRoutes=require('./routes/Shop');
const AuthRotes=require('./routes/Auth');
const mongoConnect=require('./util/database').mongoConnect;
const csrf=require('csurf')
const ShopData=require('./controller/ShopData')

const isAuth=require('./middleware/is-auth')

const flash = require('connect-flash');


const User=require('./model/user');

const app=express();
const MONGODB_URI="mongodb+srv://chirag:Chirag@cluster0-wufjm.mongodb.net/test"



const store=new MongoDBStore({
uri:MONGODB_URI,
collection:'sessions',

})

const csrfProtection = csrf({cookie:true});




app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:'my secret' , resave:false, saveUninitialized:false ,store:store }));
app.use(flash());

//order of bellow lins is very important
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())




app.use((req,res,next)=>{
    if(!req.session.user){
        console.log('next')
        return next();
    }

User.findById(req.session.user._id)
.then(user=>{
    //  console.log(user._id);
    req.user=new User(user.email,user.password,user.cart,user._id);
    next();
})
.catch(err=>{console.log(err)}
)

}
)


app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
  });
  
  app.post('/create-order',isAuth,ShopData.postOrder);

  app.use(csrfProtection)

  app.use((req, res, next) => {
   res.locals.csrfToken = req.csrfToken();
    next();
  });

app.use('/admin',AdminRoutes);
app.use(ShopRoutes);
app.use(AuthRotes);

mongoConnect(()=>{
    app.listen(4100,()=>{
      
    console.log('started')
})
})

