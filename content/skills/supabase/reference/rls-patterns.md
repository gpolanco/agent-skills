# RLS (Row Level Security) Patterns

SQL policies for securing Supabase tables.

---

## Principles

- **ALWAYS** enable RLS on every table
- **ALWAYS** use `auth.uid()` to identify current user
- **ALWAYS** prefer RLS over app-level permission checks
- **NEVER** create policies with `USING (true)` on sensitive data

---

## Enable RLS

**When:** First step for any new table.

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

---

## Pattern: User-Owned Data

**When:** Each row belongs to a single user (profiles, settings, personal data).

```sql
-- Read
CREATE POLICY "Users read own data" ON profiles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Insert
CREATE POLICY "Users insert own data" ON profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update
CREATE POLICY "Users update own data" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Delete
CREATE POLICY "Users delete own data" ON profiles
FOR DELETE TO authenticated
USING (auth.uid() = user_id);
```

---

## Pattern: Public Read, Auth Write

**When:** Public content (blog posts, products) that only authors can edit.

```sql
-- Anyone can read published items
CREATE POLICY "Public read" ON posts
FOR SELECT TO anon, authenticated
USING (published = true);

-- Only author can modify
CREATE POLICY "Author write" ON posts
FOR UPDATE TO authenticated
USING (auth.uid() = author_id);
```

---

## Pattern: Organization/Team Access

**When:** Multi-tenant apps where users belong to organizations.

```sql
CREATE POLICY "Org members access" ON projects
FOR SELECT TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM org_members
    WHERE user_id = auth.uid()
  )
);
```

---

## Pattern: Role-Based Access

**When:** Admins or specific roles have elevated permissions.

```sql
CREATE POLICY "Admins full access" ON settings
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

---

## Pattern: Time-Based Access

**When:** Content that becomes available at a specific time.

```sql
CREATE POLICY "Published content only" ON articles
FOR SELECT TO authenticated
USING (published_at <= now());
```

---

## Anti-Patterns

**Never do this:**

```sql
-- ❌ Allows anyone to access everything
CREATE POLICY "Bad" ON sensitive_data
FOR ALL USING (true);
```

**Do this instead:**

```sql
-- ✅ Explicit user condition
CREATE POLICY "Good" ON sensitive_data
FOR SELECT TO authenticated
USING (auth.uid() = owner_id);
```

---

## Debugging

```sql
-- Check current user
SELECT auth.uid();

-- Check JWT claims
SELECT auth.jwt();
```
