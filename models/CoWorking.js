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
    tel : {
        type : String
    },
    opentime : {
        type : Date,
        required : [true , 'Please add an open time'],
    },
    closetime : {
        type : Date,
        required : [true , 'Please add a close time'],
    },
}
)



module.exports = mongoose.model('CoWorking',CoWorkingSchema);