import multer from "multer";
import multerS3 from "multer-s3";
import jwtDataGetters from "../utils/jwtDataGetters";
import { Request } from "express";
import { s3Client, BUCKET_NAME } from "../config"


const uploadPhotos = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req: Request & { photoS3Keys: string[] }, file, cb) {
            const jwtToken = req.headers.authorization;
            const username = jwtDataGetters.getUsername(jwtToken!);

            const photoS3Key = `${username}/${file.originalname}`;

            if (req.photoS3Keys === undefined) {
                req.photoS3Keys = [photoS3Key,];
            }
            else {
                req.photoS3Keys.push(photoS3Key);
            }

            cb(null, photoS3Key)
        }
    })
});

export default uploadPhotos;
