export const awsOptionsCheck = () => {
    const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, BUCKET_NAME, BUCKET_REGION } = process.env;
    if (AWS_ACCESS_KEY === undefined
        || AWS_SECRET_ACCESS_KEY === undefined
        || BUCKET_NAME === undefined
        || BUCKET_REGION === undefined) {
        throw new Error("some of the fields AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, BUCKET_NAME, BUCKET_REGION are missed in .env file.");
    }
}
