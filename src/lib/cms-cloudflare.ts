import { env } from 'cloudflare:workers';
import type { Collection } from './cms-local';

interface Statement {
  bind(...args: unknown[]): Statement;
  all<T>(): Promise<{results:T[]}>;
  first<T>(): Promise<T|null>;
  run(): Promise<unknown>;
}
interface Database { prepare(query:string): Statement; }
function database() {
  const db = (env as unknown as {CMS_DB?:Database}).CMS_DB;
  if (!db) throw new Error('CMS_DB is not configured');
  return db;
}
export async function readRecords<T>(collection:Collection): Promise<T[]> {
  const result = await database().prepare('SELECT payload FROM cms_records WHERE collection = ? ORDER BY rowid').bind(collection).all<{payload:string}>();
  return result.results.map(row => JSON.parse(row.payload) as T);
}
export async function takeLoginAttempt(key:string) {
  const now=Math.floor(Date.now()/1000);
  await database().prepare('DELETE FROM login_attempts WHERE expires < ?').bind(now).run();
  const result=await database().prepare('INSERT INTO login_attempts(key,attempts,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=attempts+1 RETURNING attempts').bind(key,now+900).first<{attempts:number}>();
  return !!result && result.attempts<=10;
}
export async function putRecord(collection:Collection, id:string, value:unknown) {
  await database().prepare('INSERT INTO cms_records(collection,id,payload) VALUES(?,?,?) ON CONFLICT(collection,id) DO UPDATE SET payload=excluded.payload').bind(collection,id,JSON.stringify(value)).run();
}
export async function removeRecord(collection:Collection,id:string) {
  await database().prepare('DELETE FROM cms_records WHERE collection=? AND id=?').bind(collection,id).run();
}
export async function saveUpload(name:string,type:string,data:ArrayBuffer) {
  await database().prepare('INSERT INTO cms_uploads(name,type,data) VALUES(?,?,?)').bind(name,type,data).run();
}
export async function readUpload(name:string) {
  const row = await database().prepare('SELECT type,data FROM cms_uploads WHERE name=?').bind(name).first<{type:string,data:number[]}>();
  return row ? {type:row.type,data:new Uint8Array(row.data)} : null;
}
