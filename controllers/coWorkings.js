const CoWorking = require('../models/CoWorking');


//@desc        Get all co-working spaces
//@route       GET /api/v1/coworking
//@access      Public
exports.getCoWorkings = async (req,res,next) => {

    let query;

    //Copy req.query
    const reqQuery = {...req.query}
    //Field to exclude
    const removeField = ['select' , 'sort','page','limit']

    //Loop over remove fields and delete them from reqQuery
    removeField.forEach(param=>delete reqQuery[param])
    //Create query string
    
    let queryStr=JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|regex)\b/g,match=>`$${match}`)
    query = CoWorking.find(JSON.parse(queryStr)).populate('appointments');

    //Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    //Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }
    else{
        query=query.sort('name')
    }
    //Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 25
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    try{
        const total = await CoWorking.countDocuments();
        query = query.skip(startIndex).limit(limit)

        //Execute query
        const coWorkings = await query;

        const pagination = {};
        if(endIndex < total){
            pagination.next={
                page:page+1,
                limit
            }
        }
        if(startIndex > 0){
            pagination.prev={
                page:page-1,
                limit
            }
        }
        res.status(200).json({success:true,count:coWorkings.length,pagination,data:coWorkings});
    } catch (err){
        res.status(400).json({success:false});
    }
    
    
}

//@desc        Get single co-working space
//@route       GET /api/v1/coworking/:id
//@access      Public
exports.getCoWorking = async (req,res,next) => {
    try{
        const coWorking = await CoWorking.findById(req.params.id);

        if(!coWorking){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:coWorking});
    } catch (err){
        res.status(400).json({success:false});
    }
}

//@desc        Create a co-working space
//@route       POST /api/v1/coworking
//@access      Private
exports.createCoWorking = async (req,res,next) => {
    const coWorking = await CoWorking.create(req.body);
    res.status(201).json({success:true,data:coWorking});
}

//@desc        Update single co-working space
//@route       PUT /api/v1/coworking/:id
//@access      Private
exports.updateCoWorking = async (req,res,next) => {
    try{
        const coWorking = await CoWorking.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });

        if(!coWorking){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true,data:coWorking});
    } catch (err){
        res.status(400).json({success:false});
    }
}

//@desc        Delete single co-working space
//@route       DELETE /api/v1/coworking/:id
//@access      Private
exports.deleteCoWorking = async (req,res,next) => {
    try{
        const coWorking = await CoWorking.findById(req.params.id);

        if(!coWorking){
            return res.status(404).json({success:false,message : `CoWorking not found with id of ${req.params.id}`});
        }
        await coWorking.deleteOne();
        res.status(200).json({success:true,data:{}});
    } catch (err){
        res.status(400).json({success:false});
    }
}
