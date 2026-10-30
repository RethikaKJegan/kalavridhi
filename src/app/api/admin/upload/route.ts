import { NextResponse } from 'next/server';
import { saveUpload } from '@/lib/cms-local';
export async function POST(request:Request) {
 const file=(await request.formData()).get('file');
 if(!(file instanceof File))return NextResponse.json({error:'Choose an image'},{status:400});
 if(file.size>1_500_000)return NextResponse.json({error:'Please upload a compressed photo smaller than 1.5 MB'},{status:413});
 const data=await file.arrayBuffer();const b=new Uint8Array(data);
 const type=b[0]===255&&b[1]===216?'image/jpeg':b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71?'image/png':String.fromCharCode(...b.slice(0,6)).startsWith('GIF8')?'image/gif':String.fromCharCode(...b.slice(0,4))==='RIFF'&&String.fromCharCode(...b.slice(8,12))==='WEBP'?'image/webp':null;
 if(!type)return NextResponse.json({error:'Choose a valid JPEG, PNG, WebP or GIF image'},{status:400});
 const ext=type==='image/jpeg'?'jpg':type.split('/')[1];
 const name=crypto.randomUUID()+'.'+ext;
 await saveUpload(name,type,data);
 return NextResponse.json({url:'/images/uploads/'+name});
}
