import { Router } from "express";
import photographerController from "../controllers/PhotographerController";
import authenticate from "../middlewares/Authentication";
import photographerMiddleware from "../middlewares/PhotographerMiddleware";
import uploadPhotos from "../middlewares/Multer";


const photographerRouter = Router();

photographerRouter.post("/sign-up",
    photographerMiddleware.authValidation,
    photographerMiddleware.usernameValidation,
    photographerController.signUp
);

photographerRouter.post("/log-in",
    photographerMiddleware.authValidation,
    photographerController.logIn
);

photographerRouter.post("/create-album",
    authenticate,
    photographerMiddleware.createAlbumValidation,
    photographerController.createAlbum
);

photographerRouter.post("/upload-photos",
    authenticate,
    photographerMiddleware.uploadPhotosValidation,
    uploadPhotos,
    photographerController.uploadPhotos
);

photographerRouter.post("/add-clients-to-photos",
    authenticate,
    photographerMiddleware.addClientsToPhotosValidation,
    photographerController.addClientsToPhotos
);

photographerRouter.get("/get-all-albums",
    authenticate,
    photographerController.getAllAlbums
);

photographerRouter.get("/get-photos-by-album-id",
    authenticate,
    photographerMiddleware.albumIdValidation,
    photographerController.getPhotosByAlbumId
);

// TODO: add possibility to add client to already created album.

export default photographerRouter;
