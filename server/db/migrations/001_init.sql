
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

do $$ begin
  create type role as enum ('ems','medic','admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists app_user (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique,
  pass_hash text,
  role role not null default 'ems',
  created_at timestamptz not null default now()
);

create table if not exists patient (
  id uuid primary key default gen_random_uuid(),
  firstname text not null,
  lastname  text not null,
  dob date,
  blood_type text,
  allergies_summary text,
  created_by uuid references app_user(id),
  created_at timestamptz not null default now()
);

create table if not exists allergy (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patient(id) on delete cascade,
  label text not null,
  severity text
);

create table if not exists visit (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patient(id) on delete cascade,
  reason text,
  status text not null default 'open',
  triage_level int,
  admitted_at timestamptz not null default now(),
  discharged_at timestamptz,
  created_by uuid references app_user(id)
);

create table if not exists note (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visit(id) on delete cascade,
  author_id uuid references app_user(id),
  type text,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists prescription (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visit(id) on delete cascade,
  drug text not null,
  dosage text,
  instructions text,
  prescribed_by uuid references app_user(id),
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id bigserial primary key,
  user_id uuid references app_user(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  timestamp timestamptz not null default now(),
  payload jsonb
);

create index if not exists idx_patient_name on patient(lastname, firstname);
create index if not exists idx_visit_patient on visit(patient_id);
create index if not exists idx_note_visit on note(visit_id);
