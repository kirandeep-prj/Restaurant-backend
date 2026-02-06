const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const Menu = require("../../models/menu");

//add items staff only
exports.addItem =catchAsync(async(req, res, next)=>{
    const {name, Category, price, isVegetarian, isAvailable, preparationTime} =req.body;
    const menu = await Menu.create({
        name,
        Category,
        price,
        isVegetarian,
        isAvailable,
        preparationTime,
        user:req.user.id,
    });
    res.status(201).json(menu);
})

//update menu items staff only
exports.updateItem = catchAsync(async(req,res,next)=>{
    const item = await Menu.findByIdAndUpdate(req.params.id,req.body,{new: true});
    if(!item){
        return next(new AppError("item not found"),404);
    }
    await item.save();
    res.status(200).json({
        success:"true",
        item
    })
})

//soft deleted items by staff only
exports.softDeleteItem = catchAsync(async(req,res,next)=>{
    const item = await Menu.findByIdAndUpdate(req.params.id,
        {
            isDeleted:true,
            deletedAt: new Date()
        },
        {new:true}
    );
    if (!item) {
    return next(new AppError("Menu item not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Menu item soft deleted"
  });
})

//Restore soft-deleted item by staff only
exports.restoreMenuItem = catchAsync(async (req, res, next) => {
    const item = await Menu.findById(req.params.id);

    if (!item) {
        return next(new AppError("Item not found", 404));
    }

    if (!item.isDeleted) {
        return next(new AppError("Item is not deleted", 400));
    }

    item.isDeleted = false;
    item.deletedAt = null;
    await item.save();

    res.status(200).json({
        success: true,
        message: "Menu item restored"
    });
});

//toggleavaliable by staff only
exports.toggleAvailable = catchAsync(async(req,res,next)=>{
    const item = await Menu.findOne({_id:req.params.id});
    if(!item){
        return next(new AppError("Item not found",404));
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.status(200).json({
        status:"success",
        isAvailable:item.isAvailable,
        item
    });
});

exports.getAllItems = catchAsync(async(req,res,next)=>{
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
    if(req.query.isAvailable !== undefined){
        filters.isAvailable = req.query.isAvailable === "true";
    }
    if(req.query.isDeleted !== undefined){
        filters.isDeleted = req.query.isDeleted === "true";
    }
   
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
