import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const blob = file as Blob;
    const buffer = Buffer.from(await blob.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "products",
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    // TS infers result as "any" but it's the Cloudinary UploadApiResponse
    return NextResponse.json({ url: (result as any).secure_url });
  } catch (err) {
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}