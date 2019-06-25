let express = require("express"),
    morgan = require("morgan"),
    authRouter = require("./Routers/authorization"),
    path = require("path"),
    adminRouter=require("./Routers/admin"),
    speakerRouter=require("./Routers/speakers"),
    eventRouter=require("./Routers/eventsRouter"),
    UserRouter=require("./Routers/User"),
    cookie_parser=require("cookie-parser"),
    connect_flash=require("connect-flash"),
    express_session=require("express-session"),
    express_ejs_layouts=require("express-ejs-layouts"),
    bodyParser = require("body-parser"),
    mongoose=require("mongoose");

    mongoose.connect("mongodb://localhost:27017/itiEvents");
let server = express();

//1- first Middleware

//2- second Middleware
// server.use((request, response, next) => {
//     let minutes = (new Date()).getMinutes();
//     if (minutes > 20) {
//         next();
//     } else {
//         next(new Error("not Authorized"));
//     }
// });


//3- third Middleware
server.use(morgan("short"));

//4-fourth Middleware
// server.use((error, request, response, next) => {
//     response.send("Error " + error);
// });

server.use(/\//, (request, response) => {
    response.render("home");
});


server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
//server.use(express_session());
server.use(express_session({
    secret:"asdfgh",
    resave:true,
    saveUninitialized:true
}));
server.use(cookie_parser());
server.use(connect_flash());
server.use(express.static(path.join(__dirname, "publics")));
server.use(bodyParser.urlencoded({
    extended:true
}
));



//server.engine('.html', require('ejs').renderFile);
server.use(express_ejs_layouts);
server.set("layout",path.join("layouts","layout"));
//server.use(express.static(path.join(__dirname,"node_modules","jquery","dist")));
//server.use(express.static(path.join(__dirname,"node_modules","bootstrap","dist","js","css")));

server.use("/ProfileUser", (request, response) => {
    response.render("users/ProfileUser",{
        name:request.body.name,
        email:request.body.email,
        jobtitel:request.body.JobTitle,
        birthdate:request.body.date,
        gender:request.body.gender,
        pic:request.body.myPic,
        layout:'layouts/UserLayout'
    });
});

server.use("/ProfileAdmin", (request, response) => {
    response.render("Admin/ProfileAdmin",{layout:'layouts/AdminLayout'})
});

server.use(authRouter);
// server.use((request,response,next)=>{
//     if(request.session.your_name&&request.session.your_pass){
//         next();
//     }
//     else{
//         request.flash("msg","session Ended");
//         response.redirect("/login");
//     }
// });

server.use(adminRouter);
server.use("/speakers",speakerRouter);
server.use("/events",eventRouter);
server.use("/users",UserRouter);


server.use((request, response) => {
    response.send("Not Found");
});

server.listen(8080, () => {
    console.log("I am Listening ......");
});