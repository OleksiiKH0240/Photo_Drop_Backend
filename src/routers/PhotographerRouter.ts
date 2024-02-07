import { Router } from "express";
import photographerController from "../controllers/PhotographerController";
import authenticate from "../middlewares/Authentication";
import photographerMiddleware from "../middlewares/PhotographerMiddleware";
import uploadPhotos from "../middlewares/Multer";


const photographerRouter = Router();

photographerRouter.post("/signUp",
    photographerMiddleware.authValidation,
    photographerMiddleware.usernameValidation,
    photographerController.signUp
);

photographerRouter.post("/logIn", photographerMiddleware.authValidation, photographerController.logIn);

photographerRouter.post("/createAlbum",
    authenticate,
    photographerMiddleware.createAlbumValidation,
    photographerController.createAlbum
);

photographerRouter.post("/uploadPhotos",
    authenticate,
    photographerMiddleware.uploadPhotosValidation,
    uploadPhotos.any(),
    photographerController.uploadPhotos
);

photographerRouter.post("/addClientsToPhotos",
    authenticate,
    photographerMiddleware.addClientsToPhotosValidation,
    photographerController.addClientsToPhotos
);

photographerRouter.get("/getAllAlbums",
    authenticate,
    photographerController.getAllAlbums
);

photographerRouter.get("/getPhotosByAlbumId",
    authenticate,
    photographerMiddleware.albumIdValidation,
    photographerController.getPhotosByAlbumId
);

// TODO: add possibility to add client to already created album.

export default photographerRouter;
