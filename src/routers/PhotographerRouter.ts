import { Router } from "express";
import photographerController from "../controllers/PhotographerController";
import authenticate from "../middlewares/Authentication";
import photographerMiddleware from "../middlewares/PhotographerMiddleware";


const photographerRouter = Router();

photographerRouter.post("/signUp",
    photographerMiddleware.authValidation,
    photographerMiddleware.usernameValidation,
    photographerController.signUp);

photographerRouter.post("/logIn", photographerMiddleware.authValidation, photographerController.logIn);

// photographerRouter.get("/getAll", authenticate, photographerController.getAll);

photographerRouter.post("/createAlbum",
    authenticate,
    photographerMiddleware.createAlbumValidation,
    photographerController.createAlbum);

photographerRouter.post("/uploadPhotos",
    authenticate,
    photographerMiddleware.uploadPhotosValidation,
    photographerMiddleware.uploadPhotos,
    photographerController.uploadPhotos);

photographerRouter.get("/getAllAlbums",
    authenticate,
    photographerController.getAllAlbums
)

photographerRouter.get("/getPhotosByAlbumId",
    authenticate,
    photographerMiddleware.albumIdValidation,
    photographerController.getPhotosByAlbumId
)

export default photographerRouter;
