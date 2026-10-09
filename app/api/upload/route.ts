import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.aws_region!,
});


// const s3 = new S3Client({
//   region: process.env.AWS_REGION!,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const buffer = Buffer.from(await file.arrayBuffer());
 
  const params = {
    Bucket: process.env.aws_s3_bucket_name!,
    Key: `uploads/${Date.now()}-${file.name}`, // when the file will upload , it will store in uploads folder the , this name ;
    Body: buffer,
    ContentType: file.type
  };

  try {
    const result = await s3.upload(params).promise();
    return NextResponse.json({ url: result.Location });
  } catch (error) {
    return NextResponse.json({ error: 'Upload Failed'}, {status: 500})
  }

  //   const key = `uploads/${Date.now()}-${file.name}`;

  //   const uploadParams = {
  //     Bucket: process.env.AWS_S3_BUCKET_NAME!,
  //     Key: key,
  //     Body: buffer,
  //     ContentType: file.type,
  //   };

  //   try{
  //   await s3.send(new PutObjectCommand(uploadParams));
  //   const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  //   return NextResponse.json({ url });
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json({ error: 'Upload Failed' }, { status: 500 });
  // }  


}
