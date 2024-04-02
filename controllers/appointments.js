const Appointment = require('../models/Appointment');
const CoWorking = require('../models/CoWorking');

//@desc      Get all appointments
//@route     GET /api/v1/appointments
//@access    Public
exports.getAppointments=async (req,res,next)=>{
    let query;
    //General users can see only their appointments!
    if(req.user.role !== 'admin'){
        query=Appointment.find({user:req.user.id}).populate({
            path:'coWorking',
            select: 'name province tel'
        }
        ).populate({
            path:'user',
            select: 'name'
            } )  ;
    }else{
        //If you are an admin, you can see all!
        if(req.params.coWorkingId) {
            query=Appointment.find({coWorking:req.params.coWorkingId}).populate({
                path: 'coWorking' ,
                select: 'name province tel',

            }).populate({
                path:'user',
                select: 'name'
                } ) ;
        }else {
            query=Appointment.find().populate({
                path:'coWorking' ,
                select: 'name province tel'
            }).populate({
                path:'user',
                select: 'name'
            }) ;
        }
        
    }
    try {
        const appointments= await query;

        res.status(200).json({
            success:true,
            count:appointments.length,
            data: appointments
        });
    } catch (err) {
        return res.status(500).json({success:false,message:"Cannot find Appointment"});
    }
}

//@desc      Get single appointments
//@route     GET /api/v1/appointments/:id
//@access    Public
exports.getAppointment=async (req,res,next) =>{
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path:'coWorking' ,
            select: 'name province tel'
        });

        if (!appointment){
            return res.status(404).json({success:false,message:`No appoitment with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success:true,
            data: appointment
        });
    } catch (error){
        return res.status(500).json({success:false,message:"Cannot find Appointment"});
    }
};

//@desc    Add appointment
//@route   POST /api/v1/coWorkings/:coWorkingId/appointment
//@access  Private
exports.addAppointment=async (req,res,next)=>{
    try {
        req.body.coWorking = req.params.coWorkingId;

        const coWorking = await CoWorking.findById(req.params.coWorkingId);

        if(!coWorking){
            return res.status(404).json({success:false,message:`No coWorking with the id of ${req.params.coWorkingId}`});

        }
        //add user id to req.body
        req.body.user=req.user.id;

        //Check for existed appointment
        const existedAppointment = await Appointment.find({user:req.user.id});

        //If the user is not an admin, they can only create 3 appointment.
        if (existedAppointment.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message: `The user with ID ${req.user.id} has already made 3 appointments`});
        }


        const appointment = await Appointment.create(req.body);

        res.status(201).json({
            success:true,
            data: appointment
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Cannot create Appointment"
        });
    }
}

//@desc    Update appointment
//@route   PUT /api/v1/coWorkings/:id
//@access  Private
exports.updateAppointment=async (req,res,next)=>{
    try {
        let appointment = await Appointment.findById(req.params.id);
        

        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});

        }

        //Make sure user is the appointment owner
        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this appointment`});
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        }).populate({
            path:'coWorking' ,
            select: 'name province tel'
        });

        res.status(200).json({
            success:true,
            data: appointment
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Cannot update Appointment"
        });
    }
}

//@desc    Delete appointment
//@route   DELETE /api/v1/coWorkings/:id
//@access  Private
exports.deleteAppointment=async (req,res,next)=>{
    try {
        let appointment = await Appointment.findById(req.params.id);
        

        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});

        }

        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this bootcamp`});
        }

        await appointment.deleteOne();

        res.status(200).json({
            success:true,
            data: {}
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Cannot delete Appointment"
        });
    }
}
