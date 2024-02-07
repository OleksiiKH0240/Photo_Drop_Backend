import { Router } from "express";
import clientController from "../controllers/ClientController";
import clientMiddleware from "../middlewares/ClientMiddleware";
import uploadPhotos from "../middlewares/Multer";
import authenticate from "../middlewares/Authentication";


const clientRouter = Router();

clientRouter.get("/prepare-auth",
    clientMiddleware.prepareAuthValidation,
    clientController.prepareAuth
);

clientRouter.post("/auth",
    clientMiddleware.authValidation,
    clientController.auth
);

clientRouter.post("/upload-selfy",
    authenticate,
    uploadPhotos.any(),
    clientController.uploadSelfy
);

clientRouter.get("/get-selfies",
    authenticate,
    clientController.getSelfies
);

clientRouter.post("/set-name-email",
    authenticate,
    clientMiddleware.nameValidation,
    clientMiddleware.emailValidation,
    clientController.setNameEmail
);

clientRouter.post("/set-name",
    authenticate,
    clientMiddleware.nameValidation,
    clientController.setName
);

clientRouter.get("/get-all-albums",
    authenticate,
    clientController.getAllAlbums
);

clientRouter.get("/get-album-by-id",
    authenticate,
    clientMiddleware.albumIdValidation,
    clientController.getAlbumById
);

clientRouter.get("/get-all-photos",
    authenticate,
    clientController.getAllPhotos
);

clientRouter.post("/unlock-photo",
    authenticate,
    clientMiddleware.photoIdValidation,
    clientController.unlockPhoto
);

export default clientRouter;
