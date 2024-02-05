import "dotenv/config";
import { jwtOptionsCheck, saltRoundsCheck } from "./utils/checks/authOptionsChecks";
import express from "express";
import cors from "cors";
import indexRep from "./database/repositories/IndexRep";
import clientRouter from "./routers/ClientRouter";
import photographerRouter from "./routers/PhotographerRouter";
import errorHandlers from "./middlewares/ErrorHandlers";
import { awsOptionsCheck } from "./utils/checks/awsOptionsChecks";


const APP_PORT = Number(process.env.APP_PORT) || 80;
jwtOptionsCheck();
saltRoundsCheck();
awsOptionsCheck();

const app = express();

app.use(express.json())
app.use(cors())

app.use("/clients", clientRouter);
app.use("/photographers", photographerRouter);

app.use(errorHandlers.errorLogger);
app.use(errorHandlers.errorResponder);

app.listen({ port: APP_PORT }, async () => {
    await indexRep.init();
    console.log(`app is listening on port ${APP_PORT}.`)
})
