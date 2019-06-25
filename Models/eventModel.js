let mongoose=require("mongoose");
//let AutoIncrement = require('mongoose-sequence')(mongoose);

let eventSchema=new mongoose.Schema({
    _id:Number,
    title:{
        type:String,
        required:true
    },
    eventDate:{
        type:Date,
        default:Date.now
    },
    mainSpeaker:{
        type:Number,
        ref:"speakers"
    },
    others:[{
        type:Number,
        ref:"speakers"
    }]
});

//eventSchema.plugin(AutoIncrement, {inc_field: '_id'});

mongoose.model("events",eventSchema);