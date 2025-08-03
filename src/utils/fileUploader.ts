import { getPresignUrlAPI, uploadToS3API } from "@/api/fileApi";

const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

export const binaryToFile = (dataURL: string, fileName: string) => {
  const [meta, base64] = dataURL.split(",");
  const mimeMatch = meta.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(base64);
  const len = binary.length;
  const u8arr = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    u8arr[i] = binary.charCodeAt(i);
  }

  return new File([u8arr], fileName, { type: mime });
};

export const fileUploader = async (files: File[]): Promise<string[]> => {
  const urls: string[] = [];

  await Promise.all(
    files.map(async (file) => {
      try {
        const presignURL = await getPresignUrlAPI(file.name);

        if (!presignURL) {
          throw new Error(`presignURL is missing for file: ${file.name}`);
        }
        const url = new URL(presignURL);
        const internalPath = "api/s3/upload";
        const newURL = new URL(
          `${internalPath}${url.pathname}${url.search}`,
          window.location.origin
        );
        await uploadToS3API(newURL.toString(), file);
        urls.push(`${S3_BASE_URL}/${file.name}`);
      } catch (error) {
        console.error("Upload failed:", file.name, error);
      }
    })
  );

  return urls;
};
