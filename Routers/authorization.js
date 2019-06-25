let express = require("express"),
    authRouter = express.Router(),
    path = require("path"),
    bodyParser = require("body-parser"),
    mongoose=require("mongoose"),
    fs=require("fs"),
    multer=require("multer");
    multerMW=multer({
    dest:path.join(__dirname,"..","publics","images")
    });
    require("../Models/speakerModel");
    let registerSchema=mongoose.model("speakers");

authRouter.get("/login", (request, response) => {
    //response.locals.msg=request.flash("msg");
    response.render("auther/login",{layout:false});
});

authRouter.post("/login", bodyParser.urlencoded(),(request, response) => {
    console.log(request.body.your_name)
        registerSchema.findOne({fullName:request.body.your_name,password:request.body.your_pass},(error,result)=>{
            if(result){
                response.redirect("/speakers/Profile/"+request.body.your_name);
            }
            else if (request.body.your_name == "asmaafarhat" && request.body.your_pass == "Asmaa123") {
                request.session.your_name=request.body.your_name;
                request.session.your_pass=request.body.your_pass;
                response.render("Admin/ProfileAdmin",{layout:'layouts/AdminLayout'});
            }
            else {
                request.flash("msg","User name or password is incorrected");
                response.render("auther/login",{layout:false});
            }
    });
});
authRouter.get("/register", (request, response) => {
    response.render("auther/register",{layout:false});
});
authRouter.post("/register",/*multerMW.single("RegisterImage"),*/ (request, response) => {
    //fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});
        let regist=new registerSchema({
            fullName:request.body.name,
            email:request.body.email,
            jobTitle:request.body.JobTitle,
            password:request.body.pass,
            birthDate:request.body.date,
            gender:request.body.gender,
            image:request.body.myPic,
            "Address.city":"",
            "Address.street":"",
            "Address.building":""
        });
        regist.save((error)=>{
            if(!error){
                console.log("add");
                response.redirect("/speakers/Profile/"+request.body.name);
            }
        });
});
authRouter.get("/logout", (request, response) => {
    request.session.destroy((error)=>{
        response.redirect("/login");
    })
});



module.exports = authRouter;