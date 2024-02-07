import { jwtOptionsCheck, saltRoundsCheck } from "./authOptionsChecks";
import { awsOptionsCheck } from "./awsOptionsChecks";
import { telegramBotOptionsCheck } from "./telegramBotOptionsChecks"


const dotEnvCheck = () => {
    jwtOptionsCheck();
    saltRoundsCheck();
    awsOptionsCheck();
    telegramBotOptionsCheck()
}

export default dotEnvCheck;
