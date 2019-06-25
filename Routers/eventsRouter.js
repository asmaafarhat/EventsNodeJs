let express=require("express"),
eventRouter=express.Router(),
path=require("path"),
mongoose=require("mongoose");

require("../Models/speakerModel")
require("../Models/eventModel")

let eventSchema=mongoose.model("events");
let speakerSchema=mongoose.model("speakers");

eventRouter.get("/add",(request,response)=>{

    speakerSchema.find({},(error,result)=>{
        response.render("events/addevent",{speakers:result,layout:'layouts/AdminLayout'});
    })
})
eventRouter.post("/add",(request,response)=>{
    let event=new eventSchema({
        _id:request.body.id,
        title:request.body.title,
        mainSpeaker:request.body.mainSpeaker,
        others:request.body.otherSpeakers
    });
    event.save((error)=>{
        if(!error)
        {
        response.redirect("/events/list");
        }
    });
})
eventRouter.get("/list",(request,response)=>{
    eventSchema.find({}).populate({"path":"mainSpeaker others"}).then((result)=>{
        response.render("events/eventsList",{events:result,layout:'layouts/AdminLayout'});
    })
})


eventRouter.get("/edit/:id",(request,response)=>{
    eventSchema.findOne({_id:request.params.id},(error,result)=>{
        speakerSchema.find({},(error,data)=>{
        response.render("events/editevent",{event:result,speakers:data,layout:'layouts/AdminLayout'})
        })
    });
});

eventRouter.post("/edit/:id",(request,response)=>{
    eventSchema.update({_id:request.params.id},{
        "$set":{
            Name:request.body.name,
            title:request.body.title,
            eventDate:request.body.eventDate,
            mainSpeaker:request.body.mainSpeaker,
            others:request.body.otherSpeakers
        }
    },(error)=>{
        if(!error)
        {
            response.redirect("/events/list");
        }
    })
});

eventRouter.get("/delete/:id",(request,response)=>{
    eventSchema.deleteOne({_id:request.params.id},(error)=>{
        if(!error)
        response.redirect("/events/list");
    })
});


module.exports=eventRouter;