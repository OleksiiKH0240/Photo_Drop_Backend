import "dotenv/config";
import express from "express";
import cors from "cors";
import indexRep from "./database/repositories";
import clientRouter from "./routers/ClientRouter";
import photographerRouter from "./routers/PhotographerRouter";
import errorHandlers from "./middlewares/ErrorHandlers";
import dotEnvCheck from "./utils/checks";
import bot from "./services/TelegramBotService";


dotEnvCheck();
bot;

const APP_PORT = Number(process.env.APP_PORT) || 80;


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
