import { randomUUID } from "crypto";
import * as minio from "minio";
import { env } from "~/env";
export const minioClient = new minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  secretKey: env.MINIO_SECRET,
  accessKey: env.MINIO_KEY,
  useSSL: true,
});

export const generatePresignedUrlUpload = async ({
  objectName = "",
  bucket = "fablab",
  isPublic = false,
  maxSize = 5 * 1024 * 1024, //5MB
  expires = 24 * 60 * 60, // 1 day
  contentDisposition,
  contentType,
  metadata,
}: {
  objectName?: string;
  expires?: number;
  bucket?: string;
  maxSize?: number;
  contentDisposition?: string;
  contentType?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
}) => {
  "use server";
  objectName = objectName === "" ? randomUUID() : `${randomUUID()}-${objectName}`; 
  const isProd = env.NODE_ENV === "development" ? "dev" : "prod";
  const poilicy = minioClient.newPostPolicy();
  const pub = isPublic ? "public" : "private";
  poilicy.setBucket(bucket);
  poilicy.setKey(`${pub}/${isProd}/${objectName}`);

  if (expires) {
    const date = new Date();
    date.setSeconds(expires);
    poilicy.setExpires(date);
  };
  if (maxSize) poilicy.setContentLengthRange(0, maxSize);
  if (contentDisposition) poilicy.setContentDisposition(contentDisposition);
  if (contentType) poilicy.setContentType(contentType);
  if (metadata) poilicy.setUserMetaData(metadata);
  const res = await minioClient.presignedPostPolicy(poilicy);
  return res
};
