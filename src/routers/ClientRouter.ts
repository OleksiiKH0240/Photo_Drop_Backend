import { Router } from "express";
import clientController from "../controllers/ClientController";
import clientMiddleware from "../middlewares/ClientMiddleware";
import uploadPhotos from "../middlewares/Multer";
import authenticate from "../middlewares/Authentication";


const clientRouter = Router();

clientRouter.get("/prepareAuth",
    clientMiddleware.prepareAuthValidation,
    clientController.prepareAuth
);

clientRouter.post("/auth",
    clientMiddleware.authValidation,
    clientController.auth
);

clientRouter.post("/uploadSelfy",
    authenticate,
    uploadPhotos.any(),
    clientController.uploadSelfy
);

clientRouter.get("/getSelfies",
    authenticate,
    clientController.getSelfies
);

clientRouter.post("/setNameEmail",
    clientMiddleware.nameValidation,
    clientMiddleware.emailValidation,
    authenticate,
    clientController.setNameEmail
);

clientRouter.post("/setName",
    clientMiddleware.nameValidation,
    authenticate,
    clientController.setName
);

clientRouter.get("/getAllAlbums",
    authenticate,
    clientController.getAllAlbums
);

clientRouter.get("/getAlbumById",
    authenticate,
    clientMiddleware.albumIdValidation,
    clientController.getAlbumById
);

clientRouter.get("/getAllPhotos",
    authenticate,
    clientController.getAllPhotos
);

clientRouter.post("/unlockPhoto",
    authenticate,
    clientMiddleware.photoIdValidation,
    clientController.unlockPhoto
);

export default clientRouter;
