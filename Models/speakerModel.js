let mongoose=require("mongoose");
let AutoIncrement = require('mongoose-sequence')(mongoose),
   mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

let speakerSchema=new mongoose.Schema({
    _id:Number,
    fullName:{
        type:String,
        required:true
    },
    email:String,
    jobTitle:String,
    Address:{
        city:String,
        street:String,
        building:String
    },
    birthDate:Date,
    image:String,
    gender:String,
    password:{
        type: String 
    }
});

speakerSchema.plugin(AutoIncrement, {inc_field: '_id'});
//speakerSchema.plugin(mongooseFieldEncryption, { fields: ["message", "password"], secret: "asdfghh",__enc_message: false });
mongoose.model("speakers",speakerSchema);

