create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  avatar_url text,
  role text not null default 'student' check (role in ('admin', 'instructor', 'student')),
  theme text not null default 'light' check (theme in ('light', 'dark')),
  sidebar_collapsed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists sidebar_collapsed boolean not null default false;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.email, ''), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() = old.id and not public.is_admin() then
    if new.role is distinct from old.role
      or new.email is distinct from old.email
      or new.id is distinct from old.id
      or new.created_at is distinct from old.created_at then
      raise exception 'Only an administrator can change protected profile fields';
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text,
  status text not null default 'active' check (status in ('active', 'draft', 'archived', 'completed')),
  instructor_id uuid references public.profiles(id) on delete set null,
  duration_weeks integer check (duration_weeks is null or duration_weeks > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  status text not null default 'active' check (status in ('active', 'completed', 'withdrawn')),
  created_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  course_id uuid references public.courses(id) on delete set null,
  instructor_id uuid references public.profiles(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  room text,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  target_role text check (target_role is null or target_role in ('admin', 'instructor', 'student')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  created_at timestamptz not null default now(),
  unique (class_id, student_id)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'submitted', 'graded')),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text not null default 'Ejire Tech',
  description text not null,
  created_at timestamptz not null default now()
);

create or replace view public.instructor_directory
with (security_barrier = true)
as
select id, full_name, avatar_url
from public.profiles
where role = 'instructor';

revoke all on public.instructor_directory from anon, public;
grant select on public.instructor_directory to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar owners can read objects" on storage.objects;
create policy "Avatar owners can read objects" on storage.objects for select to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Avatar owners can upload objects" on storage.objects;
create policy "Avatar owners can upload objects" on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Avatar owners can replace objects" on storage.objects;
create policy "Avatar owners can replace objects" on storage.objects for update to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Avatar owners can delete objects" on storage.objects;
create policy "Avatar owners can delete objects" on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create index if not exists enrollments_student_id_idx on public.enrollments(student_id);
create index if not exists enrollments_course_id_idx on public.enrollments(course_id);
create index if not exists classes_starts_at_idx on public.classes(starts_at);
create index if not exists notifications_user_id_created_at_idx on public.notifications(user_id, created_at desc);
create index if not exists announcements_created_at_idx on public.announcements(created_at desc);
create index if not exists assignments_course_due_at_idx on public.assignments(course_id, due_at);

create or replace function public.is_course_instructor(course_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.courses c
    where c.id = course_uuid and c.instructor_id = (select auth.uid())
  );
$$;

create or replace function public.is_class_instructor(class_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.classes c
    where c.id = class_uuid and c.instructor_id = (select auth.uid())
  );
$$;

create or replace function public.is_enrolled(course_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.enrollments e
    where e.course_id = course_uuid and e.student_id = (select auth.uid()) and e.status = 'active'
  );
$$;

create or replace function public.is_enrolled_in_class(class_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.classes c
    join public.enrollments e on e.course_id = c.course_id
    where c.id = class_uuid and e.student_id = (select auth.uid()) and e.status = 'active'
  );
$$;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields before update on public.profiles
for each row execute function public.protect_profile_fields();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.classes enable row level security;
alter table public.announcements enable row level security;
alter table public.notifications enable row level security;
alter table public.attendance enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.activities enable row level security;

drop policy if exists "Profiles visible to self and admins" on public.profiles;
create policy "Profiles visible to self and admins" on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_admin());
drop policy if exists "Profiles update by self or admin" on public.profiles;
create policy "Profiles update by self or admin" on public.profiles for update to authenticated
using (id = (select auth.uid()) or public.is_admin())
with check (id = (select auth.uid()) or public.is_admin());

drop policy if exists "Courses visible to authenticated users" on public.courses;
create policy "Courses visible to authenticated users" on public.courses for select to authenticated using (true);
drop policy if exists "Admins manage courses" on public.courses;
create policy "Admins manage courses" on public.courses for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Instructors manage assigned courses" on public.courses;
create policy "Instructors manage assigned courses" on public.courses for update to authenticated
using (instructor_id = (select auth.uid())) with check (instructor_id = (select auth.uid()));

drop policy if exists "Enrollment visible by authorized users" on public.enrollments;
create policy "Enrollment visible by authorized users" on public.enrollments for select to authenticated
using (student_id = (select auth.uid()) or public.is_admin() or public.is_course_instructor(course_id));
drop policy if exists "Admins manage enrollments" on public.enrollments;
create policy "Admins manage enrollments" on public.enrollments for all to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Students enroll themselves" on public.enrollments;
create policy "Students enroll themselves" on public.enrollments for insert to authenticated
with check (student_id = (select auth.uid()) and exists (select 1 from public.courses c where c.id = course_id and c.status = 'active'));

drop policy if exists "Classes visible by role" on public.classes;
create policy "Classes visible by role" on public.classes for select to authenticated
using (public.is_admin() or instructor_id = (select auth.uid()) or public.is_enrolled_in_class(id));
drop policy if exists "Admins manage classes" on public.classes;
create policy "Admins manage classes" on public.classes for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Instructors update assigned classes" on public.classes;
create policy "Instructors update assigned classes" on public.classes for update to authenticated
using (instructor_id = (select auth.uid())) with check (instructor_id = (select auth.uid()));

drop policy if exists "Announcements visible by target role" on public.announcements;
create policy "Announcements visible by target role" on public.announcements for select to authenticated
using (public.is_admin() or target_role is null or target_role = (select role from public.profiles where id = (select auth.uid())));
drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements" on public.announcements for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users see their notifications" on public.notifications;
create policy "Users see their notifications" on public.notifications for select to authenticated
using (user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "Users update their notifications" on public.notifications;
create policy "Users update their notifications" on public.notifications for update to authenticated
using (user_id = (select auth.uid()) or public.is_admin())
with check (user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "Admins create notifications" on public.notifications;
create policy "Admins create notifications" on public.notifications for insert to authenticated with check (public.is_admin());

drop policy if exists "Attendance visible by role" on public.attendance;
create policy "Attendance visible by role" on public.attendance for select to authenticated
using (public.is_admin() or student_id = (select auth.uid()) or public.is_class_instructor(class_id));
drop policy if exists "Admins manage attendance" on public.attendance;
create policy "Admins manage attendance" on public.attendance for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Instructors record attendance" on public.attendance;
create policy "Instructors record attendance" on public.attendance for insert to authenticated
with check (public.is_class_instructor(class_id));

drop policy if exists "Assignments visible by course access" on public.assignments;
create policy "Assignments visible by course access" on public.assignments for select to authenticated
using (public.is_admin() or public.is_course_instructor(course_id) or public.is_enrolled(course_id));
drop policy if exists "Admins manage assignments" on public.assignments;
create policy "Admins manage assignments" on public.assignments for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Instructors manage course assignments" on public.assignments;
create policy "Instructors manage course assignments" on public.assignments for all to authenticated
using (public.is_course_instructor(course_id)) with check (public.is_course_instructor(course_id));

drop policy if exists "Submissions visible by role" on public.assignment_submissions;
create policy "Submissions visible by role" on public.assignment_submissions for select to authenticated
using (public.is_admin() or student_id = (select auth.uid()) or exists (
  select 1 from public.assignments a where a.id = assignment_id and public.is_course_instructor(a.course_id)
));
drop policy if exists "Students submit own assignments" on public.assignment_submissions;
create policy "Students submit own assignments" on public.assignment_submissions for insert to authenticated
with check (student_id = (select auth.uid()) and exists (
  select 1 from public.assignments a where a.id = assignment_id and public.is_enrolled(a.course_id)
));
drop policy if exists "Admins and instructors grade submissions" on public.assignment_submissions;
create policy "Admins and instructors grade submissions" on public.assignment_submissions for update to authenticated
using (public.is_admin() or exists (select 1 from public.assignments a where a.id = assignment_id and public.is_course_instructor(a.course_id)))
with check (public.is_admin() or exists (select 1 from public.assignments a where a.id = assignment_id and public.is_course_instructor(a.course_id)));

drop policy if exists "Activities visible to admins" on public.activities;
drop policy if exists "Activities visible to admins and owners" on public.activities;
create policy "Activities visible to admins and owners" on public.activities for select to authenticated
using (public.is_admin() or actor_id = (select auth.uid()));
drop policy if exists "Admins manage activities" on public.activities;
create policy "Admins manage activities" on public.activities for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.courses, public.enrollments, public.classes, public.announcements,
  public.notifications, public.attendance, public.assignments, public.assignment_submissions, public.activities to authenticated;
revoke all on function public.is_admin() from public;
revoke all on function public.is_course_instructor(uuid) from public;
revoke all on function public.is_class_instructor(uuid) from public;
revoke all on function public.is_enrolled(uuid) from public;
revoke all on function public.is_enrolled_in_class(uuid) from public;
revoke all on function public.handle_new_user() from public;
revoke all on function public.protect_profile_fields() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_course_instructor(uuid) to authenticated;
grant execute on function public.is_class_instructor(uuid) to authenticated;
grant execute on function public.is_enrolled(uuid) to authenticated;
grant execute on function public.is_enrolled_in_class(uuid) to authenticated;
