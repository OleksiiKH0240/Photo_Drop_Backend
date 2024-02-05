import { S3Client } from "@aws-sdk/client-s3";


const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY!;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;
export const BUCKET_NAME = process.env.BUCKET_NAME!;
const BUCKET_REGION = process.env.BUCKET_REGION!;

export const s3Client = new S3Client({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    region: BUCKET_REGION
});
