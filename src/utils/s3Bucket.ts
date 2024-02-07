import { GetObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, s3Client } from "../config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const generateSignedUrl = async (photoS3Key: string) => {
    const signedUrlTtl = Number(process.env.SIGNED_URL_TTL) || 60;
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: photoS3Key });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: signedUrlTtl });
    return signedUrl;
}

export const generateSignedPhotos = async ({ photoId, photoS3Key, isLocked }:
    {
        photoId: number,
        photoS3Key: string,
        isLocked?: boolean
    }) => {
    const signedUrl = await generateSignedUrl(photoS3Key);
    return { photoId, photoS3Key, signedUrl, isLocked };
}
