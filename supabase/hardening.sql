begin;

alter table public.student_enrollments
    add column if not exists guardian_approved boolean not null default false;

do $$
begin
    if exists (
        select 1 from information_schema.columns
        where table_schema = 'public'
          and table_name = 'student_enrollments'
          and column_name = 'disability'
    ) then
        alter table public.student_enrollments
            drop constraint if exists student_enrollments_disability_check;
        alter table public.student_enrollments
            add column if not exists access_support_requested boolean;
        update public.student_enrollments
        set access_support_requested = case disability
            when 'yes' then true
            when 'no' then false
            else null
        end
        where access_support_requested is null;
        alter table public.student_enrollments drop column disability;
    end if;
    if not exists (
        select 1 from information_schema.columns
        where table_schema = 'public'
          and table_name = 'student_enrollments'
          and column_name = 'access_support_requested'
    ) then
        alter table public.student_enrollments
            add column access_support_requested boolean;
    end if;
    if not exists (
        select 1 from pg_constraint
        where conrelid = 'public.student_enrollments'::regclass
          and conname = 'student_enrollments_age_group_check'
    ) then
        alter table public.student_enrollments
            add constraint student_enrollments_age_group_check
            check (age_group in ('13-17', '18-24', '25-34', '35-plus')) not valid;
    end if;
    if not exists (
        select 1 from pg_constraint
        where conrelid = 'public.student_enrollments'::regclass
          and conname = 'student_enrollments_guardian_check'
    ) then
        alter table public.student_enrollments
            add constraint student_enrollments_guardian_check
            check (age_group <> '13-17' or guardian_approved) not valid;
    end if;
    if exists (
        select 1
        from public.student_enrollments
        group by user_id, course
        having count(*) > 1
    ) then
        raise exception 'Duplicate student/course enrollments exist. Resolve them before applying the unique enrollment index.';
    end if;
end;
$$;

create unique index if not exists student_enrollments_user_course_unique
    on public.student_enrollments (user_id, course);

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

commit;
