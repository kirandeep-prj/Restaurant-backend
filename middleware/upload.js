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
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png images are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // ✅ 2MB
  },
  fileFilter,
});


module.exports=upload;