export const telegramBotOptionsCheck = () => {
    const { BOT_TOKEN, OTP_TTL } = process.env;
    if (BOT_TOKEN === undefined
        || OTP_TTL === undefined) {
        throw new Error("some of the fields BOT_TOKEN, OTP_TTL are missed in .env file.");
    }
}
