const User=require('../model/user');
const bcrypt=require('bcryptjs')
const crypto=require('crypto');
const {validationResult}=require('express-validator/check')


const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
   
      api_key:"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"
    }
  })
);

exports.getLogin=(req,res,next)=>{
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
 
  

    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login',
        errorMessage:message
      
       
    })

}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
 
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage:message,
    product:{
      OldEmail:"",
      OldPassword:"",
    OldconfirmPassword:""
    }
    ,
    hasError:false
  
  });
};

exports.postLogin=(req,res,next)=>{
  const email=req.body.email;
  const password=req.body.password
    User.findOne(email)
    .then(user => {
        if(!user){
          req.flash('error', 'Invalid email or password.');
          return res.redirect('/login')
        }
        bcrypt.compare(password,user.password).then(doMatch=>{
          if(doMatch){
            
            req.session.isLoggedIn = true;
            req.session.user = user;
          // console.log(req.session.user);
          return  req.session.save(err => {
            console.log(err);
            
             res.redirect('/')
           });
          }
          req.flash('error', 'Wrong password Entered');
            res.redirect('/login')
        }).catch(err=>{
          console.log(err);
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login')
        })

     
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
     // console.log(err);
      res.redirect('/');
    });
  };
  
  exports.postSignup = (req, res, next) => {

                    const email=req.body.email;
                    const password =req.body.password;
                    const confirmPassword=req.body.confirmPassword;
                    const errors=validationResult(req)
                 if(!errors.isEmpty()){
                   console.log(errors.array()[0])
                  return res.status(422).render('auth/signup', {
                    path: '/signup',
                    pageTitle: 'Signup',
                    errorMessage:errors.array()[0].msg,
                    product:{
                      OldEmail:email,
                      OldPassword:password,
                    OldconfirmPassword:confirmPassword
                    }
                    ,
                    hasError:true
                  
                  });
                 }

                    User.findOne(email).then(userDoc=>{
                      if(userDoc){
                       
                        return res.status(422).render('auth/signup', {
                          path: '/signup',
                          pageTitle: 'Signup',
                          errorMessage:'Email Already Exist',
                          product:{
                            OldEmail:email,
                            OldPassword:password,
                          OldconfirmPassword:confirmPassword
                          }
                          ,
                          hasError:true
                        
                        });
                      }
                      return bcrypt.hash(password,12).then(hashPassword=>{
                        const cart={item:[]}

                        const user=new User(email,hashPassword,cart)
                           return user.save()
  
                      })
                       .then(result=>{
                              // console.log(email)
                               res.redirect('/login')
                        return transporter.sendMail({
                          to: email,
                          from: 'jani.chiragkumar.943@ldce.ac.in',
                          subject: 'Signup succeeded!',
                          html: '<h1>You successfully signed up!</h1>'
                        });
                     
                     
                      })
                      .catch(err=>{

                        console.log(err)
                    })

                    }).catch(err=>{
                      console.log(err)
                    })

                  


  };


  exports.getResetPassword=(req,res,next)=>{
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
   
    res.render('auth/reset',{
               path:"/reset",
               pageTitle:"Reset Password",
               errorMessage:message



    })
}

exports.postResetPassword=(req,res,next)=>{
      const email=req.body.email;
      crypto.randomBytes(32,(err,buffer)=>{

        if(err){
         // console.log(err)
          return redirect('/reset')
        }
        const token=buffer.toString('hex');
        User.findOne(email).then(
          user=>{
            if(!user){
              req.flash('error','Email not have Account')
              return res.redirect('/reset')
            }
            resetToken=token;
            TokenExpiration=Date.now()+3600000
            user=new User(user.email,user.password,user.cart,user._id,resetToken,TokenExpiration)
         
            return user.save();
          }
        )
        .then(result=>{
         // console.log(result);
                 res.redirect('/')
          transporter.sendMail({
            to: email,
            from: 'jani.chiragkumar.943@ldce.ac.in',
            subject: 'Password Reset',
            html: `
            <p>Click This <a herf="localhost:4100/reset/${token}">link</a> to reset password</p>
            
            `
          });
        }).catch(err=>{
          console.log(err)
        })
        
        .catch(err=>{
          console.log(err)
        
        })

      })

}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
     // console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne( req.body.email )
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        const resetToken=token;
        const  TokenExpiration= new Date(Date.now() +3600000) ;
         //console.log(TokenExpiration)
          user=new User(user.email,user.password,user.cart,user._id,resetToken,TokenExpiration)
       
          return user.save()
          .then(result => {
            res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'jani.chiragkumar.943@ldce.ac.in',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:4100/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      
      })
      
      .catch(err => {
        console.log(err);
      });
  });
};

exports.updatePassword=(req,res,next)=>{

  const resetToken=req.params.token
 const curDate=new Date(Date.now());

  User.findByToken(resetToken,curDate).then(user=>{
   // console.log(user)
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
   
    res.render('auth/newPassword',{
               path:"/new-password",
               pageTitle:"New Password",
               errorMessage:message,
               UserId:user._id.toString()
               ,token:resetToken



    })

  })
  .catch(err=>{
console.log(err)
    req.flash('error','This is not Token in the link')
    res.redirect('/reset')
  })


}

exports.postNewPassword=(req,res,next)=>{
                                const newPassword=req.body.password;
                                const UserId=req.body.UserId;
                                const token=req.body.token

                                const curDate=new Date(Date.now())
                                let resetUser;

                                User.findById_Token(UserId,token,curDate)
                                .then(user=>{
                                 // console.log(user)
                                 resetUser=new User(user.email,user.password,user.cart,user._id,user.resetToken,user.TokenExpiration)
                                       return bcrypt.hash(newPassword,12)
                               
                                })
                                .then(hashedPassword=>{
                                      // console.log(resetUser.email)
                                 resetUser=new User(resetUser.email,hashedPassword,resetUser.cart,resetUser._id,undefined,undefined)
                                return   resetUser.save()
                                
                                })
                                .then(result=>{
                                 // console.log(result)
                                  res.redirect('/login')
                                })
                                  .catch(err=>{
                                    console.log(err)
                                  })


                                

}
