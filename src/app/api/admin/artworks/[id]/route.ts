import { NextResponse } from 'next/server';
import { readRecords,putRecord,removeRecord } from '@/lib/cms-local';
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const current=(await readRecords<{id:string}>('artworks')).find(item=>item.id===id);
 if(!current)return NextResponse.json({error:'Not found'},{status:404});
 const body=await request.json();
 const updated={...current,...body,id};
 await putRecord('artworks',id,updated);
 return NextResponse.json(updated);
}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;await removeRecord('artworks',id);return NextResponse.json({ok:true});
}
