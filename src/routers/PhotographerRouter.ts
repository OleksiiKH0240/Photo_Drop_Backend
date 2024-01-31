import { Router } from "express";
import photographerController from "../controllers/PhotographerController";
import authenticate from "../middlewares/Authentication";
import photographerMiddleware from "../middlewares/PhotographerMiddleware";
import multerUpload from "../middlewares/Multer"


const photographerRouter = Router();

photographerRouter.post("/signUp",
    photographerMiddleware.authFieldsExistanceCheck,
    photographerMiddleware.usernameValidation,
    photographerController.signUp);

photographerRouter.post("/logIn", photographerMiddleware.authFieldsExistanceCheck, photographerController.logIn);

photographerRouter.get("/getAll", authenticate, photographerController.getAll);

photographerRouter.post("/createAlbum",
    authenticate,
    photographerMiddleware.albumFieldsExistanceCheck,
    photographerController.createAlbum);

photographerRouter.post("/uploadPhotos", authenticate, multerUpload, photographerController.uploadPhotos);

export default photographerRouter;
