-- SUPABASE / POSTGRESQL — rode no SQL Editor do Supabase.
-- Para MySQL local, use sistema_login_mysql.sql.
-- No Supabase, e-mail/senha ficam em auth.users; esta tabela guarda só dados extras.

create table if not exists public.usuarios (
    id uuid primary key references auth.users(id) on delete cascade,
    login text not null unique,
    criado_em timestamptz not null default now()
);

alter table public.usuarios enable row level security;

-- Cada usuário só pode ver e criar o próprio perfil.
drop policy if exists "Usuario ve proprio perfil" on public.usuarios;
create policy "Usuario ve proprio perfil"
    on public.usuarios
    for select
    using (auth.uid() = id);

drop policy if exists "Usuario cria proprio perfil" on public.usuarios;
create policy "Usuario cria proprio perfil"
    on public.usuarios
    for insert
    with check (auth.uid() = id);

-- Depois de criar o usuário em Authentication > Users, rode:
-- insert into public.usuarios (id, login)
-- select id, email
-- from auth.users
-- where email = 'prof@email.com'
-- on conflict (id) do nothing;

-- Nunca armazene senhas nesta tabela.
-- select id, login, criado_em from public.usuarios;
