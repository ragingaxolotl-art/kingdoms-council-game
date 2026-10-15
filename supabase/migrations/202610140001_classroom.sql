-- Private classroom state. Browser clients never read these tables directly.
create table if not exists public.classroom_sessions (
 id uuid primary key,
 owner_id uuid not null references auth.users(id) on delete cascade,
 version bigint not null default 0 check (version >= 0),
 body jsonb not null,
 updated_at timestamptz not null default now()
);
create index if not exists classroom_sessions_owner on public.classroom_sessions(owner_id);
alter table public.classroom_sessions enable row level security;
revoke all on public.classroom_sessions from anon, authenticated;
grant all on public.classroom_sessions to service_role;
create table if not exists public.classroom_presence (
 class_id uuid not null references public.classroom_sessions(id) on delete cascade,
 member_id text not null,
 seen_at bigint not null,
 primary key(class_id, member_id)
);
alter table public.classroom_presence enable row level security;
revoke all on public.classroom_presence from anon, authenticated;
grant all on public.classroom_presence to service_role;
create table if not exists public.classroom_login_limits (
 key text primary key,
 bucket bigint not null,
 attempts integer not null
);
alter table public.classroom_login_limits enable row level security;
revoke all on public.classroom_login_limits from anon, authenticated;
grant all on public.classroom_login_limits to service_role;
create or replace function public.classroom_login_limit(limit_key text, max_attempts integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare current_bucket bigint := floor(extract(epoch from now()) / 60); count_now integer;
begin
 insert into public.classroom_login_limits as limits(key,bucket,attempts)
 values(limit_key,current_bucket,1)
 on conflict(key) do update set bucket=current_bucket,
 attempts=case when limits.bucket=current_bucket then limits.attempts+1 else 1 end
 returning attempts into count_now;
 delete from public.classroom_login_limits where bucket < current_bucket-10;
 return count_now <= max_attempts;
end;
$$;
revoke all on function public.classroom_login_limit(text,integer) from public, anon, authenticated;
grant execute on function public.classroom_login_limit(text,integer) to service_role;

-- Server-only bootstrap settings. Never exposed to student or teacher browsers.
create table if not exists public.classroom_private_config (
 key text primary key,
 value text not null
);
alter table public.classroom_private_config enable row level security;
revoke all on public.classroom_private_config from public, anon, authenticated;
grant select on public.classroom_private_config to service_role;
insert into public.classroom_private_config(key,value)
values ('pin_pepper',replace(gen_random_uuid()::text || gen_random_uuid()::text,'-',''))
on conflict(key) do nothing;
