import { getPresignUrlAPI, uploadToS3API } from "@/api/fileApi";

export const fileUploader = async (files: File[]) => {
  await Promise.all(
    files.map(async (file) => {
      try {
        const presignURL = await getPresignUrlAPI(file.name);

        if (!presignURL) {
          throw new Error(`presignURL is missing for file: ${file.name}`);
        }

        await uploadToS3API(presignURL, file);
      } catch (error) {
        console.error("Upload failed:", file.name, error);
      }
    })
  );
};
