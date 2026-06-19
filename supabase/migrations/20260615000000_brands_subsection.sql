-- Categorize brands for Beyond the Desk → brands getting it right (d2c, b2b, b2b2c, b2c)

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'brands'
  ) then
    alter table public.brands
      add column if not exists subsection text;

    -- Backfill from legacy category when it already matches a subsection slug
    update public.brands
    set subsection = lower(regexp_replace(trim(category), '[\s_-]+', '', 'g'))
    where subsection is null
      and category is not null
      and trim(category) <> ''
      and lower(regexp_replace(trim(category), '[\s_-]+', '', 'g')) in ('d2c', 'b2b', 'b2b2c', 'b2c');

    -- Default uncategorized brands to d2c so they still appear
    update public.brands
    set subsection = 'd2c'
    where subsection is null or trim(subsection) = '';

    alter table public.brands
      drop constraint if exists brands_subsection_check;

    alter table public.brands
      add constraint brands_subsection_check
      check (subsection in ('d2c', 'b2b', 'b2b2c', 'b2c'));

    comment on column public.brands.subsection is
      'Brand bucket for the desk app: d2c, b2b, b2b2c, or b2c';
  end if;
end $$;
