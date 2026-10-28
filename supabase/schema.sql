create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    full_name text not null default '',
    role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
    created_at timestamptz not null default now()
);

create table if not exists public.student_enrollments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course text not null check (course in ('full-stack', 'vibe-coding', 'graphic-design', 'data-analytics', 'google-admob')),
    age_group text not null check (age_group in ('13-17', '18-24', '25-34', '35-plus')),
    guardian_approved boolean not null default false,
    education_level text not null,
    class_year text check (char_length(class_year) <= 120),
    current_status text not null,
    experience_level text not null,
    access_support_requested boolean,
    access_needs text check (char_length(access_needs) <= 2000),
    learning_goal text check (char_length(learning_goal) <= 2000),
    device_access text not null,
    constraint student_enrollments_guardian_check check (age_group <> '13-17' or guardian_approved),
    created_at timestamptz not null default now()
);

create unique index if not exists student_enrollments_user_course_unique
    on public.student_enrollments (user_id, course);

alter table public.profiles enable row level security;
alter table public.student_enrollments enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.student_enrollments from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (full_name) on table public.profiles to authenticated;
grant select, insert, update on table public.student_enrollments to authenticated;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.has_app_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles
        where id = (select auth.uid())
          and role = required_role
    );
$$;

revoke all on function private.has_app_role(text) from public, anon, authenticated;
grant execute on function private.has_app_role(text) to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
    on public.profiles for select to authenticated
    using ((select auth.uid()) = id);

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
    on public.profiles for select to authenticated
    using ((select private.has_app_role('admin')));

drop policy if exists "Users can update their own name" on public.profiles;
create policy "Users can update their own name"
    on public.profiles for update to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);

drop policy if exists "Students can read their own enrollments" on public.student_enrollments;
create policy "Students can read their own enrollments"
    on public.student_enrollments for select to authenticated
    using ((select auth.uid()) = user_id and (select private.has_app_role('student')));

drop policy if exists "Admins can read all enrollments" on public.student_enrollments;
create policy "Admins can read all enrollments"
    on public.student_enrollments for select to authenticated
    using ((select private.has_app_role('admin')));

drop policy if exists "Students can create their own enrollments" on public.student_enrollments;
create policy "Students can create their own enrollments"
    on public.student_enrollments for insert to authenticated
    with check ((select auth.uid()) = user_id and (select private.has_app_role('student')));

drop policy if exists "Students can update their own enrollments" on public.student_enrollments;
create policy "Students can update their own enrollments"
    on public.student_enrollments for update to authenticated
    using ((select auth.uid()) = user_id and (select private.has_app_role('student')))
    with check ((select auth.uid()) = user_id and (select private.has_app_role('student')));

create or replace function public.create_student_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', ''),
        'student'
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

revoke all on function public.create_student_profile() from public, anon, authenticated;

drop trigger if exists create_student_profile_after_signup on auth.users;
create trigger create_student_profile_after_signup
    after insert on auth.users
    for each row execute procedure public.create_student_profile();