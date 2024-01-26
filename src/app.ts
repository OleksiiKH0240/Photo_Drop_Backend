import "dotenv/config";
import { jwtOptionsCheck, saltRoundsCheck } from "./utils/authOptionsChecks";
import express from "express";
import cors from "cors";
import initialRep from "./database/repositories/InitialRep";
import userRouter from "./routers/UserRouter";
import clientRouter from "./routers/ClientRouter";
import photographerRouter from "./routers/PhotographerRouter";
import errorHandlers from "./middlewares/ErrorHandlers";


const APP_PORT = Number(process.env.APP_PORT) || 80;
jwtOptionsCheck();
saltRoundsCheck();

const app = express();

app.use(express.json())
app.use(cors())

app.use("/users", userRouter);
app.use("/clients", clientRouter);
app.use("/photographers", photographerRouter);

app.use(errorHandlers.errorLogger);
app.use(errorHandlers.errorResponder);

app.listen({ port: APP_PORT }, async () => {
    await initialRep.init();
    console.log(`app is listening on port ${APP_PORT}.`)
})
