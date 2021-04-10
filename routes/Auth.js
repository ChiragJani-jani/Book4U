const express=require('express');
const bodyParser=require('body-parser')
const {check,body}=require('express-validator/check')

const AuthData=require('../controller/AuthData')
var urlencodedParser=bodyParser.urlencoded({extended:false})
const router=express.Router()

router.get('/login',AuthData.getLogin)
router.post('/login',urlencodedParser,AuthData.postLogin);

router.post('/logout',urlencodedParser,AuthData.postLogout)

router.post('/signup',
[check('email')
.isEmail()
.withMessage('Please Enter Valide Email'),
body('password','Please Enter PassWord of Minimum 6 character and They Should Alphanumerical')
.isLength({min:6})
.isAlphanumeric(),
body('confirmPassword')
.custom((value, { req }) => {
    if(value!==req.body.password){
        throw new Error("Password And Confirm Don't match ")
    }
    return true;
})
]

,urlencodedParser,
AuthData.postSignup);

router.get('/signup', AuthData.getSignup);
router.get('/reset',AuthData.getResetPassword)

router.post('/reset',urlencodedParser,AuthData.postReset)

router.get('/reset/:token',AuthData.updatePassword)

router.post('/new-password',urlencodedParser,AuthData.postNewPassword)
module.exports=router