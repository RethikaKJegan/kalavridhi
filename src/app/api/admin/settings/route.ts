import { NextResponse } from 'next/server';
import { readRecords,putRecord } from '@/lib/cms-local';
export async function GET(){return NextResponse.json((await readRecords('site-settings'))[0]||{});}
export async function PUT(request:Request){
 const current=(await readRecords<Record<string,unknown>>('site-settings'))[0]||{};
 const updated={...current,...await request.json()};
 await putRecord('site-settings','settings',updated);return NextResponse.json(updated);
}
