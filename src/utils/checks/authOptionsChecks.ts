export const jwtOptionsCheck = () => {
    if (process.env.JWT_SECRET === undefined || process.env.JWT_TTL === undefined) {
        throw new Error("JWT_SECRET or JWT_TTL fields are missed in .env file.");
    }
}

export const saltRoundsCheck = () => {
    if (process.env.SALT_ROUNDS === undefined) {
        throw new Error("SALT_ROUNDS field is missed in .env file.");
    }
}
