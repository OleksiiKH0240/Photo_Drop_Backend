class jwtDataGetters {
    getUsername = (jwtToken: string): string => {
        const [, jwtPayloadStr,] = jwtToken.replace(/Bearer */, "").split(".");
        const jwtPayload = JSON.parse(Buffer.from(jwtPayloadStr, "base64").toString());
        const username: string = jwtPayload.username;
        return username;
    }

    getPhotographerId = (jwtToken: string): number => {
        const [, jwtPayloadStr,] = jwtToken.replace(/Bearer */, "").split(".");
        const jwtPayload = JSON.parse(Buffer.from(jwtPayloadStr, "base64").toString());
        const photographerId: number = jwtPayload.photographerId;
        return photographerId;
    }
}

export default new jwtDataGetters();
