import multer from "multer";
import multerS3 from "multer-s3";
import jwtDataGetters from "../utils/jwtDataGetters";
import { NextFunction, Request, Response } from "express";
import { s3Client, BUCKET_NAME } from "../config"


const allowedMimeTypes = [
    "image/png",
    "image/webp",
    "image/jpeg"
];

const uploadPhotos = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req: Request & { photoS3Keys: string[] }, file, cb) {
            // console.log(file.mimetype);

            const jwtToken = req.headers.authorization;
            const username = jwtDataGetters.getUsername(jwtToken!);

            let photoS3Key;
            if (username.match(/^[0-9]+$/)) {
                // client selfies upload
                photoS3Key = `selfies/${username}/${file.originalname}`;
            }
            else {
                // photographer photos upload
                const albumId = Number(req.query.albumId);
                photoS3Key = `withoutWatermark/${username}/${albumId}/${file.originalname}`;
            }

            if (req.photoS3Keys === undefined) {
                req.photoS3Keys = [photoS3Key,];
            }
            else {
                req.photoS3Keys.push(photoS3Key);
            }
            cb(null, photoS3Key)
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            // cb(new Error(`photo type is not allowed. upload photo with type: [${allowedMimeTypes}].`));
            // cb(null, false);
            req.res?.status(400).json({ message: `photo type is not allowed. upload photo with type: [${allowedMimeTypes}].` });
        }
        else {
            cb(null, true);
        }
    }

});

const uploadPhotosMiddleware = uploadPhotos.any();

const uploadPhotosWrapper = (req: Request, res: Response, next: NextFunction) => {
    try {
        uploadPhotosMiddleware(req, res, next);
    }
    catch (error) {
        next(error);
    }
}

export default uploadPhotosWrapper;
