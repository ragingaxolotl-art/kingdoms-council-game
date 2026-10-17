create table public.battle_lab_rooms (
 id uuid primary key, version bigint not null default 0 check(version>=0),
 body jsonb not null, expires_at timestamptz not null
);
create index battle_lab_rooms_expiry on public.battle_lab_rooms(expires_at);
alter table public.battle_lab_rooms enable row level security;
revoke all on public.battle_lab_rooms from public, anon, authenticated;
grant select,insert,update,delete on public.battle_lab_rooms to service_role;
create table public.battle_lab_limits (key text primary key,bucket bigint not null,attempts integer not null);
create index battle_lab_limits_bucket on public.battle_lab_limits(bucket);
alter table public.battle_lab_limits enable row level security;
revoke all on public.battle_lab_limits from public,anon,authenticated;
grant select,insert,update,delete on public.battle_lab_limits to service_role;
create function public.battle_lab_limit(limit_key text,max_attempts integer) returns boolean
language plpgsql security invoker set search_path='' as $$
declare current_bucket bigint:=floor(extract(epoch from now())/60); n integer;
begin
 insert into public.battle_lab_limits as l(key,bucket,attempts) values(limit_key,current_bucket,1)
 on conflict(key) do update set bucket=current_bucket, attempts=case when l.bucket=current_bucket then l.attempts+1 else 1 end returning attempts into n;
 delete from public.battle_lab_limits where bucket<current_bucket-60;
 delete from public.battle_lab_rooms where expires_at<now();
 return n<=max_attempts;
end;$$;
revoke all on function public.battle_lab_limit(text,integer) from public,anon,authenticated;
grant execute on function public.battle_lab_limit(text,integer) to service_role;
