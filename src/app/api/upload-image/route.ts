import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to base64 string
    const buffer = Buffer.from(await (file as Blob).arrayBuffer());
    const mimeType = (file as Blob).type;
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(dataUri, {
      folder: 'products',
      resource_type: 'image',
    });
    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
