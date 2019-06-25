let express=require("express"),
UserRouter=express.Router(),
path=require("path"),
mongoose=require("mongoose");

require("../Models/speakerModel")
require("../Models/eventModel")

let eventSchema=mongoose.model("events");
let speakerSchema=mongoose.model("speakers");


UserRouter.get("/list",(request,response)=>{
    eventSchema.find({}).populate({"path":"mainSpeaker others"}).then((result)=>{
        response.render("users/eventList",{events:result,layout:'layouts/UserLayout'});
    });
});




module.exports=UserRouter;