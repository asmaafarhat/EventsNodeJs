let express=require("express"),
adminRouter=express.Router(),
path=require("path");

adminRouter.get("/ProfileAdmin",(request,response)=>{
    response.render("user/ProfileAdmin");
});

module.exports=adminRouter;