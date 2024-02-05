import jwt from "jsonwebtoken";
import clientRep from "../database/repositories/ClientRep";
import jwtDataGetters from "../utils/jwtDataGetters";
import { getBotUsername } from "./TelegramBotService"



class ClientService {
    prepareAuth = async (username: string) => {
        username = username.replace(/[^0-9]/g, "");
        const clientExists = await clientRep.hasClientWithUsername(username);
        if (!clientExists) {
            await clientRep.addClient(username);
        }

        const botUsername = await getBotUsername();
        const telegramBotLink = `https://t.me/${botUsername}?start=${username}`;
        return { telegramBotLink };
    }

    auth = async (username: string, otp: string) => {
        username = username.replace(/[^0-9]/g, "");
        const client = await clientRep.getClientByUsername(username);
        if (client.otp === null) {
            return {
                isOtpNull: true,
                isOtpExpired: undefined,
                isOtpWrong: undefined,
                token: undefined
            }
        }

        // console.log("client.otpExpiredTimestamp", client.otpExpiredTimestamp?.getTime());
        if (client.otpExpiredTimestamp!.getTime() < new Date().getTime()) {
            return {
                isOtpNull: false,
                isOtpExpired: true,
                isOtpWrong: undefined,
                token: undefined
            }
        }

        if (client.otp !== otp) {
            return {
                isOtpNull: false,
                isOtpExpired: false,
                isOtpWrong: true,
                token: undefined
            }
        }

        const ttl = Number(process.env.JWT_TTL);
        const JWT_SECRET = String(process.env.JWT_SECRET);
        const token = jwt.sign(
            {
                username: client.username,
                clientId: client.clientId,
            },
            JWT_SECRET, { expiresIn: ttl });

        return {
            isOtpNull: false,
            isOtpExpired: false,
            isOtpWrong: false,
            token
        }

    }
}

export default new ClientService();
