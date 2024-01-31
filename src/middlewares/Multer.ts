import multer from "multer";


const upload = multer({dest: "temp/photo_uploads/"});
export default upload.any(); 

