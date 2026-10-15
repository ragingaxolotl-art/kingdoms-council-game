// Durable local preview store. Production uses database CAS below.
import fs from 'node:fs/promises';
import path from 'node:path';
export class LocalStore {
  constructor(directory) { this.directory=directory; this.rows=new Map(); this.seen={}; this.rates=new Map(); this.queue=Promise.resolve(); }
  async init() { if(this.directory){await fs.mkdir(this.directory,{recursive:true});for(const name of await fs.readdir(this.directory))if(/^[a-f0-9-]{36}\.json$/.test(name)){const row=JSON.parse(await fs.readFile(path.join(this.directory,name),'utf8'));this.rows.set(row.id,row);}}return this; }
  clientIP() { return 'local-preview'; }
  async load(id) { return structuredClone(this.rows.get(id)||null); }
  async list(owner) { return [...this.rows.values()].filter(r=>r.owner===owner).map(r=>({id:r.id,name:r.session.name,closed:r.session.closed,year:r.session.game.turn})); }
  async write(row) { if(this.directory){const file=path.join(this.directory,row.id+'.json');await fs.writeFile(file+'.tmp',JSON.stringify(row),{mode:0o600});await fs.rename(file+'.tmp',file);}this.rows.set(row.id,structuredClone(row)); }
  async insert(row) { return this.lock(async()=>{if(this.rows.has(row.id))throw Error('Exists');await this.write(row);}); }
  lock(fn) { const p=this.queue.then(fn);this.queue=p.catch(()=>{});return p; }
  async cas(version,row) { return this.lock(async()=>{if(this.rows.get(row.id)?.version!==version)return false;await this.write(row);return true;}); }
  async touch(id,member,at) { (this.seen[id]??={})[member]=at; }
  async presence(id) { return this.seen[id]||{}; }
  async rate(key,limit,at) { const bucket=Math.floor(at/60000),entry=this.rates.get(key);const n=entry?.bucket===bucket?entry.n+1:1;this.rates.set(key,{bucket,n});return n<=limit; }
}
