const mongoose=require('mongoose');

const AppointmentSchema=new mongoose.Schema({
    startTime: {
        type: Date,
        required:true
    },
    endTime: {
        type: Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User' ,
        required:true
    },
    coWorking: {
        type:mongoose.Schema.ObjectId,
        ref: 'CoWorking' ,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Appointment' ,AppointmentSchema);