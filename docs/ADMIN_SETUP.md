# Admin Setup

Phase Team-4 uses the signed-in user's normal Supabase session. The app does
not use a service role key and does not let users promote themselves to admin.

The admin dashboard expects team-based RLS:

- `profiles.role` is `admin` or `member`
- `profiles.team_id` points to the user's team
- admins can read users and progress rows only for their own team

If your schema already has equivalent team columns and policies, adapt the SQL
instead of duplicating objects.

## 1. Create Teams

```sql
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles
add column if not exists team_id uuid references public.teams(id);
```

Create one team:

```sql
insert into public.teams (name)
values ('Argos Team')
returning id;
```

Keep the returned `id`; the examples below call it `<TEAM_ID>`.

## 2. Assign Users

Assign an existing user to the team:

```sql
update public.profiles
set team_id = '<TEAM_ID>'
where email = 'member@example.com';
```

Promote one trusted user to admin:

```sql
update public.profiles
set role = 'admin',
    team_id = '<TEAM_ID>'
where email = 'admin@example.com';
```

Do this only from Supabase SQL/admin tools. The app does not include any UI for
self-promotion.

## 3. Add Team Helper Functions

These functions let RLS check the current user's team and role without exposing
secrets to the app.

```sql
create or replace function public.current_user_team_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select team_id
  from public.profiles
  where id = auth.uid()
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and team_id is not null
  )
$$;
```

## 4. Profiles RLS

Keep the member self-read/self-insert policies from
`docs/SUPABASE_AUTH_POLICIES.md`. Add admin team read access:

```sql
create policy "Admins can read team profiles"
on public.profiles
for select
to authenticated
using (
  public.current_user_is_admin()
  and team_id = public.current_user_team_id()
);
```

If you already have a broader profile select policy, make sure it still prevents
non-admin users from reading other team members.

## 5. Progress Table RLS

Existing member policies should continue to allow users to read/write their own
rows. Add read-only admin team policies for progress tables:

```sql
create policy "Admins can read team user status"
on public.user_status
for select
to authenticated
using (
  public.current_user_is_admin()
  and exists (
    select 1
    from public.profiles p
    where p.id = user_status.user_id
      and p.team_id = public.current_user_team_id()
  )
);

create policy "Admins can read team day progress"
on public.day_progress
for select
to authenticated
using (
  public.current_user_is_admin()
  and exists (
    select 1
    from public.profiles p
    where p.id = day_progress.user_id
      and p.team_id = public.current_user_team_id()
  )
);

create policy "Admins can read team practice entries"
on public.practice_entries
for select
to authenticated
using (
  public.current_user_is_admin()
  and exists (
    select 1
    from public.profiles p
    where p.id = practice_entries.user_id
      and p.team_id = public.current_user_team_id()
  )
);

create policy "Admins can read team review answers"
on public.review_answers
for select
to authenticated
using (
  public.current_user_is_admin()
  and exists (
    select 1
    from public.profiles p
    where p.id = review_answers.user_id
      and p.team_id = public.current_user_team_id()
  )
);
```

These policies are read-only for admins. Users still sync their own progress
through the existing owner insert/update policies.

## 6. Expected App Behavior

- A signed-out user sees a login prompt.
- A signed-in member sees: `Bu sayfa yalnızca ekip yöneticileri içindir.`
- An admin without `team_id` sees: `Admin kullanıcısı bir takıma bağlı değil.`
- A configured admin sees `/admin` and `/admin/users/[userId]` for users in
  the same team only.
