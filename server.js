const express = require('express');
const  dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const mongoSanitize =require('express-mongo-sanitize')
const helmet = require('helmet')
const {xss} = require('express-xss-sanitizer')
const rateLimit = require("express-rate-limit")
const hpp = require('hpp')
const cors = require('cors')

//Load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB()

//Route files
const coWorking = require('./routes/coWorking')

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());


app.use(mongoSanitize());

//Set Security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
    window: 10*60*1000, //10 mins
    max : 500
})
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());


app.use('/api/v1/coworking',coWorking);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server runnig in ',process.env.NODE_ENV, 'mode on port', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error : ${err.message}`);
    //Close server $ exit process
    server.close(()=>process.exit(1));
})