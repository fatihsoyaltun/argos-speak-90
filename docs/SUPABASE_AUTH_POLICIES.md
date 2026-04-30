# Supabase Auth Profile Policies

Use these policies only for the `public.profiles` table. They let an
authenticated user create and read their own profile row while preventing users
from self-assigning admin roles.

```sql
alter table public.profiles enable row level security;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "Users can insert own member profile"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and role = 'member'
);
```

If `role` is an enum in your schema, cast the value to that enum type, for
example `role = 'member'::profile_role`.
