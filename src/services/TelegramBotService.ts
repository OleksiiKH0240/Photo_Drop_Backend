import TelegramBot from "node-telegram-bot-api";
import clientRep from "../database/repositories/ClientRep";
import "dotenv/config";


const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token!, { polling: true, });

export const getBotUsername = async () => {
    return (await bot.getMe()).username;
}

const generateOtp = () => {
    const otp = String(Math.min(Math.floor(100000 + Math.random() * 900000), 999999));

    const OTP_TTL = Number(process.env.OTP_TTL);
    const otpExpiredTimestamp = new Date(Date.now() + (OTP_TTL * 1000))

    return { otp, otpExpiredTimestamp, OTP_TTL }
}

bot.onText(/^\/start prod_[0-9]+/, async (msg) => {
    const receivedUsername = msg.text?.split(/[ _]/).slice(2,).join("");
    bot.sendMessage(msg.chat.id, `phone number you wrote on website: {${receivedUsername}}\n`
        + "Send your phone number via telegram, so we can authenticate you.", {

        // reply_to_message_id: msg.message_id,
        reply_markup: {
            one_time_keyboard: true,
            selective: true,
            force_reply: true,
            keyboard: [
                [{
                    text: "send your phone number",
                    request_contact: true,
                }],
                [{ text: "Cancel" }]
            ]
        }
    })
})

bot.on("contact", async (msg) => {
    // console.log(msg);
    const prevMsg = msg.reply_to_message?.text;
    if (prevMsg !== undefined) {
        const receivedUsername = prevMsg.match(/{[\+0-9]+}/)![0].replace(/[\{\}]/g, "");
        const telegramPhoneNumber = msg.contact?.phone_number.slice(1,);
        if (receivedUsername === telegramPhoneNumber) {
            const { otp, otpExpiredTimestamp, OTP_TTL } = generateOtp();

            await clientRep.setClientOtp(receivedUsername, otp, otpExpiredTimestamp);
            bot.sendMessage(msg.chat.id, `your otp: ${otp}. it'll expire in ${OTP_TTL} seconds.`)
        }
        else {
            bot.sendMessage(msg.chat.id, "phone numbers are different, you are not authenticated.")
        }
    }

})

bot.onText(/^\/start dev_[0-9]+/, async (msg) => {
    const receivedUsername = msg.text?.split(/[ _]/).slice(2,).join("");
    bot.sendMessage(msg.chat.id, `phone number you wrote on website: {${receivedUsername}}`);
    const { otp, otpExpiredTimestamp, OTP_TTL } = generateOtp();

    await clientRep.setClientOtp(receivedUsername!, otp, otpExpiredTimestamp);
    bot.sendMessage(msg.chat.id, `your otp: ${otp}. it'll expire in ${OTP_TTL} seconds.`)
})

bot.onText(/get otp/, async (msg) => {
    console.log(msg);
})

console.log("bot is waiting for messages.")

export default bot;
