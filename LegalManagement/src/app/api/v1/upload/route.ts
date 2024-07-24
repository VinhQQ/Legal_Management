import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request, res: Response) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No files received.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(' ', '_');

  try {
    await writeFile(path.join(process.cwd(), 'public/assets/' + filename), buffer);
    return NextResponse.json({ message: 'Success', status_code: 201, url: `/assets/${filename}` });
  } catch (error) {
    console.log('Error occurred ', error);
    return NextResponse.json({ message: 'Failed', status_code: 500 });
  }
}
