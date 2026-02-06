const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const Menu = require("../../models/menu");

//visible all available items

exports.getAllAvailableItems = catchAsync(async(req,res,next)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page-1)*limit;
    
    const keyword = req.query.keyword
      ?{
        $or:[
            {name:{$regex:req.query.keyword, $options: "i"}},
            {Category:{$regex:req.query.keyword, $options: "i"}},
        ]
      }
    :{};

    const filters = {};
    if(req.query.Category){
        filters.Category=req.query.Category;
    }

    if(req.query.isVegetarian !== undefined){
        filters.isVegetarian = req.query.isVegetarian === "true";
    }
    filters.isAvailable = "true";
    filters.isDeleted ="false";
    if(req.query.priceMin || req.query.priceMax){
        filters.price={};
        if(req.query.priceMin){
            filters.price.$gte = Number(req.query.priceMin);
        }
        if(req.query.priceMax){
            filters.price.$lte = Number(req.query.priceMax);
        }
    }
    const totalItems = await Menu.countDocuments(filters);
    const totalPages = Math.ceil(totalItems/limit);

    const allowedSortField = ["name","price"];
    const sortField = allowedSortField.includes(req.query.sort)
      ? req.query.sort
      : "name";
    const sortOrder = req.query.order === "asc" ? 1:-1;

    const items = await Menu.find({
        ...keyword,
        ...filters
    })
    .collation({locale: "en",strength:2})
    .sort({[sortField]:sortOrder})
    .skip(skip)
    .limit(limit)
   .select("-isDeleted -deletedAt -isAvailable")

    const pagination = {
        currentPage:page,
        totalPages,
        totalItems,
        limit,
        hasNextpage:page < totalPages,
        hasPrevpage: page >1
    }

    res.json({
        success:true,
        pagination,
        results:items.length,
        items
    })
})

//get single menu item
exports.getSingleMenuItem = catchAsync(async(req,res,next)=>{
    const item = await Menu.findOne({_id:req.params.id,isAvailable:"true",isDeleted:"false"}).select("-isDeleted -deletedAt -isAvailable");
    if(!item){
        return next(new AppError("Not found or soft-deleted"),404);
    }
    res.status(200).json({
        success:true,
        data:item
    })
})

