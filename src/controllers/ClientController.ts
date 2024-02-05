import { Request, Response, NextFunction } from "express";
import clientService from "../services/ClientService";
import { authInputType } from "../types/ClientControllerTypes"


class ClientController {
    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, otp }: authInputType = req.body;
            const { isOtpNull, isOtpExpired, isOtpWrong, token } = await clientService.auth(username, otp);
            if (isOtpNull) {
                return res.status(401).json(
                    { message: "It seems like one-time password haven't been created yet, use telegram bot to generate it." })
            }

            if (isOtpExpired) {
                return res.status(401).json(
                    { message: "one-time password has expired." })
            }

            if (isOtpWrong) {
                return res.status(401).json(
                    { message: "one-time password is wrong." })
            }

            return res.status(200).json(
                {
                    token,
                    message: "client is successfully authenticated."
                })

        }
        catch (error) {
            next(error);
        }
    }

    prepareAuth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const username = String(req.query.username);
            const { telegramBotLink } = await clientService.prepareAuth(username);
            res.status(200).json({ telegramBotLink });
        }
        catch (error) {
            next(error);
        }
    }

    // getClients = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const clients = await clientRep.getClients();
    //         res.status(200).json(clients);
    //     }
    //     catch (error) {
    //         next(error);
    //     }
    // }
}

export default new ClientController();
