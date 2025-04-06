-- Create documents table
create table documents (
  id uuid default uuid_generate_v4() primary key,
  document_id text unique not null,
  filename text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on document_id for faster lookups
create index documents_document_id_idx on documents(document_id);

-- Create index on url for faster lookups
create index documents_url_idx on documents(url);

-- Enable Row Level Security (RLS)
alter table documents enable row level security;

-- Create policy to allow all operations for all users
create policy "Allow all operations for all users"
  on documents for all
  using (true)
  with check (true);