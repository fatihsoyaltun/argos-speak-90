# Supabase Progress Sync Policies

Phase Team-3 uses the signed-in user's normal Supabase session. No service role
key is used by the app.

The sync code expects these user-owned tables to have `user_id` columns and RLS
policies that only allow a user to read/write rows where `user_id = auth.uid()`.

Recommended unique constraints for upsert:

```sql
alter table public.user_status
add constraint user_status_user_id_key unique (user_id);

alter table public.day_progress
add constraint day_progress_user_day_key unique (user_id, day_number);

alter table public.practice_entries
add constraint practice_entries_user_day_key unique (user_id, day_number);

alter table public.review_answers
add constraint review_answers_user_day_item_key
unique (user_id, day_number, item_index);
```

Recommended RLS policies:

```sql
alter table public.user_status enable row level security;
alter table public.day_progress enable row level security;
alter table public.practice_entries enable row level security;
alter table public.review_answers enable row level security;

create policy "Users can read own status"
on public.user_status
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert own status"
on public.user_status
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update own status"
on public.user_status
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can read own day progress"
on public.day_progress
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert own day progress"
on public.day_progress
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update own day progress"
on public.day_progress
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can read own practice entries"
on public.practice_entries
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert own practice entries"
on public.practice_entries
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update own practice entries"
on public.practice_entries
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can read own review answers"
on public.review_answers
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert own review answers"
on public.review_answers
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update own review answers"
on public.review_answers
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
```

If you already created equivalent policies, do not duplicate them. The important
rule is that users can only read and write their own `user_id` rows.
