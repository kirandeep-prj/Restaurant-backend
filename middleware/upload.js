const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        if(file.fieldname === "menuImage"){
            cb(null,"uploads/menu");
        }
        else{
            cb(null,"uploads");
        }
    },
    filename:(req,file,cb)=>{
        const uniqueName = 
        Date.now() + "-"+Math.round(Math.random()*1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }
    else{
        cb(new Error("Only images allowed"),false);
    }
};
const upload = multer({
    storage,
    limits:{fileSize: 3*1024*1024}, //3MB
    fileFilter
});

module.exports=upload;