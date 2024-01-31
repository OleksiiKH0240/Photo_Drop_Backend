class jwtDataGetters {
    getUsername = (jwtToken: string) => {
        const [, jwtPayloadStr, ] = jwtToken.replace(/Bearer */, "").split(".");
        const jwtPayload = JSON.parse(Buffer.from(jwtPayloadStr, "base64").toString());
        const username = jwtPayload.username;
        return username;
    }
}

export default new jwtDataGetters();
