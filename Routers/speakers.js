let express=require("express"),
speakerRouter=express.Router(),
path=require("path"),
mongoose=require("mongoose"),

fs=require("fs");
multer=require("multer");
multerMW=multer({
    dest:path.join(__dirname,"..","publics","images")
});

require("../Models/speakerModel");
require("../Models/eventModel");

let speakerSchema=mongoose.model("speakers");
let eventSchema=mongoose.model("events");

//{username:request.body.name}
speakerRouter.get("/Profile/:fullName?",(request,response)=>{
    speakerSchema.findOne({fullName:request.params.fullName}).then((result)=>{
        response.render("speakers/SpeakerProfile",{speaker:result,layout:"layouts/SpeakerLayout",username:request.params.fullName});
    });
});

speakerRouter.get("/EditProfile/:fullName?",(request,response)=>{
    speakerSchema.findOne({fullName:request.params.fullName},(error,result)=>{
        response.render("speakers/EditProfile",{speaker:result,layout:'layouts/SpeakerLayout',username:request.params.fullName})
    });
})

speakerRouter.post("/EditProfile/:fullName?",/*multerMW.single("speakerImage"),*/(request,response)=>{
    //fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});
    console.log(request.body.email)
    // speakerSchema.update({fullName:request.params.fullName},{
    //     "$set":{
    //         fullName:request.body.name,
    //         email:request.body.email,
    //         password:request.body.password,
    //         jobTitle:request.body.jobTitle,
    //         // // "Address.city":request.body.Address
    //         "Address.city":"",
    //         "Address.street":"",
    //         "Address.building":"",
    //         gender:request.body.gender
    //         //image:request.file.originalname
    //     }
    // },(error)=>{
    //     if(!error)
    //     {
    //         response.redirect("/speakers/listEvents");
    //     }
    // })
})

speakerRouter.get("/listEvents/:fullName?",(request,response)=>{
    speakerSchema.findOne({fullName:request.params.fullName},(error,res)=>{
        if(!error){
            eventSchema.find({$or:[{mainSpeaker:{ "$in" : [res.id]}},{others:{ "$in" : [res.id]}}]}).populate({"path":"mainSpeaker others"}).then((result)=>{
                response.render("speakers/listEvents",{events:result,layout:'layouts/SpeakerLayout',username:request.params.fullName});
            });
        }
    });
})

speakerRouter.get("/reject/:id?&:fullName?",(request,response)=>{
    eventSchema.deleteOne({_id:request.params.id},(error)=>{
        if(!error)
        response.redirect("/speakers/listEvents/"+request.params.fullName);
    });
});

speakerRouter.get("/acceptEvent/:fullName?",(request,response)=>{
    speakerSchema.findOne({fullName:request.params.fullName},(error,res)=>{
        if(!error){
            eventSchema.find({$or:[{mainSpeaker:{ "$in" : [res.id]}},{others:{ "$in" : [res.id]}}]}).populate({"path":"mainSpeaker others"}).then((result)=>{
                response.render("speakers/acceptEvent",{events:result,layout:'layouts/SpeakerLayout',username:request.params.fullName});
                });
        }
    });
})

speakerRouter.get("/list",(request,response)=>{
    speakerSchema.find({},(error,result)=>{
        if(!error)
        response.render("speakers/speakerslist",{speakers:result,layout:'layouts/AdminLayout'});
    });//list
})

speakerRouter.get("/add",(request,response)=>{
    response.render("speakers/addspeaker",{layout:'layouts/AdminLayout'});
})
speakerRouter.post("/add",multerMW.single("speakerImage"),(request,response)=>{
    fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});
    let speaker=new speakerSchema({
        fullName:request.body.name,
        image:request.file.originalname
    });

    speaker.save((err)=>{
        if(!err)
        {
            response.redirect("/speakers/list");
        }
        else
        {
            console.log(err);
        }
    })

})

speakerRouter.get("/edit/:id",(request,response)=>{
    speakerSchema.findOne({_id:request.params.id},(error,result)=>{
        response.render("speakers/editSpeaker",{speaker:result,layout:'layouts/AdminLayout'})
    });
})

speakerRouter.post("/edit/:id",multerMW.single("speakerImage"),(request,response)=>{
    fs.rename(request.file.path,path.join(request.file.destination,request.file.originalname),()=>{});
    speakerSchema.update({_id:request.params.id},{
        "$set":{
            Name:request.body.name,
            image:request.file.originalname
        }
    },(error)=>{
        if(!error)
        {
            response.redirect("/speakers/list");
        }
    })
})

speakerRouter.get("/delete/:id",(request,response)=>{
    speakerSchema.deleteOne({_id:request.params.id},(error)=>{
        if(!error)
        response.redirect("/speakers/list");
    })
});


// speakerRouter.post("/Profile",(request,response)=>{
//     console.log("profile");
//     speakerSchema.find({}).then((result)=>{
//         response.render("speakers/SpeakerProfile",{speaker:result,layout:'layouts/SpeakerLayout'});
//     });
// });

speakerRouter.get("/listEv",(request,response)=>{
    eventSchema.find({}).populate({"path":"mainSpeaker others"}).then((result)=>{
        response.render("events/eventsList",{events:result,layout:'layouts/SpeakerLayout',username:request.params.fullName});
    })
})

speakerRouter.get("/getById/:id",(req,res)=>{
    speakerSchema.findOne({_id:req.params.id},(error,result)=>{
        if(!error)
        res.send(result);
    })

})

module.exports=speakerRouter;