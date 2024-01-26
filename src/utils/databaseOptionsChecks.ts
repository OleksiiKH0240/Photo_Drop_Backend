const databaseOptionsCheck = () => {
    const { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;
    if (PG_HOST === undefined || PG_PORT === undefined ||
        PG_DATABASE === undefined || PG_USER === undefined || PG_PASSWORD === undefined) {
        throw new Error("some database credentials are missed.");
    }
}

export default databaseOptionsCheck;