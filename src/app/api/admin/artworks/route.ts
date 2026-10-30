import { NextResponse } from 'next/server';
import { readRecords, putRecord } from '@/lib/cms-local';
export async function GET() { return NextResponse.json(await readRecords('artworks')); }
export async function POST(request:Request) {
 const body=await request.json();
 if(!body||typeof body.title!=='string'||!body.title.trim())return NextResponse.json({error:'A title is required'},{status:400});
 const current=await readRecords('artworks');
 const id='art-'+crypto.randomUUID();
 const item={published:false,featured:false,registrationOpen:false,status:'draft',sortOrder:current.length+1,consentStatus:'confirmed',...body,id};
 await putRecord('artworks',id,item);
 return NextResponse.json(item,{status:201});
}
