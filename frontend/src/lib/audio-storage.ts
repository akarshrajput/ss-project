import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function persistRemoteAudioToS3(params: {
  sourceUrl: string;
  objectPath: string;
}): Promise<string | undefined> {
  const { sourceUrl, objectPath } = params;

  const audioResponse = await fetch(sourceUrl);
  if (!audioResponse.ok) return undefined;

  const audioBuffer = await audioResponse.arrayBuffer();
  const contentType = audioResponse.headers.get("content-type") ?? "audio/mpeg";

  const bucketName = process.env.AWS_BUCKET_NAME;
  
  if (!bucketName) {
    console.error("AWS_BUCKET_NAME is not configured");
    return undefined;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectPath,
      Body: Buffer.from(audioBuffer),
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Construct the public URL
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectPath}`;
  } catch (uploadError) {
    console.error("AWS S3 upload error:", uploadError);
    return undefined;
  }
}