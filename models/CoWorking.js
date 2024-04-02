const mongoose = require('mongoose')

const CoWorkingSchema = new mongoose.Schema({
    name : {
        type :String,
        required : [true , 'Please add a name'],
        unique : true,
        trim : true,
        maxlength : [50, 'Name can not be more than 50 characters']
    },
    address : {
        type : String,
        required : [true , 'Please add an address'],
    },
    district : {
        type : String,
        required : [true , 'Please add an address'],
    },
    province : {
        type : String,
        required : [true , 'Please add a province'],
    },
    postalcode : {
        type : String,
        required : [true , 'Please add a province'],
        maxlength : [5, 'Postal Code can not be more than 5 digits']
    },
    tel : {
        type : String,
        required : [true , 'Please add a tel'],
    },
    price_hourly: {
        type : Number,
        required : [true , 'Please add a price_hourly'],
    },
    opentime : {
        type : String,
        required : [true , 'Please add an open time'],
    },
    closetime : {
        type : String,
        required : [true , 'Please add a close time'],
    },
}, {
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

CoWorkingSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'coWorking',
    justOne:false
});

CoWorkingSchema.pre('deleteOne', {document:true, query: false}, async function(next){
    await this.model('Appointment').deleteMany({hospital: this._id});

    next();
})



module.exports = mongoose.model('CoWorking',CoWorkingSchema);