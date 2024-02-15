import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, s3Client } from "../config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const generateSignedUrl = async (photoS3Key: string) => {
    const signedUrlTtl = Number(process.env.SIGNED_URL_TTL) || 60;


    // try {
    //     const headObjCommand = new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: photoS3Key });
    //     await s3Client.send(headObjCommand);
    // }
    // catch (error) {
    //     return "";
    // }


    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: photoS3Key });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: signedUrlTtl });
    return signedUrl;
}

export const generateSignedPhotos = async ({ photoId, photoS3Key, watermarkPhotoS3Key, hasWatermark, isLocked }:
    {
        photoId?: number,
        photoS3Key: string,
        watermarkPhotoS3Key: string,
        hasWatermark: boolean,
        isLocked: boolean
    }) => {

    const s3Key = (isLocked === true ? watermarkPhotoS3Key : photoS3Key);
    if (hasWatermark === false && isLocked === true) {
        return undefined;
    }
    const signedUrl = await generateSignedUrl(s3Key);

    return { photoId, s3Key, signedUrl, isLocked };
}
