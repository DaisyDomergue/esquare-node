const mongoose =require('mongoose');

const levelSchema = mongoose.Schema({
    level_name:{type:String,required:true},
    price: {type:Number ,required:true},
});


module.exports =mongoose.model('level',levelSchema);