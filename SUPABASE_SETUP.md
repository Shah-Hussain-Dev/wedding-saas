# 🗄️ Supabase Production Setup & Migration Guide for WedInvites

This guide provides step-by-step instructions to create, configure, and switch your Supabase database from your personal account to your official **WedInvites production account**.

---

## 📑 Quick Overview: What Needs to Change

In your `.env` (and your VPS production `.env`), you will update two lines:

```env
# 1. Transaction Pooler (Port 6543 with pgbouncer) — Used by your Next.js app for high performance
DATABASE_URL="postgresql://postgres.[NEW-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. Direct Connection (Port 5432) — Used by Prisma for running migrations and schema pushes
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[NEW-PROJECT-REF].supabase.co:5432/postgres"
```

---

## 🚀 Step 1: Create New Project on WedInvites Supabase Account

1. Log into your new Supabase account at **[https://supabase.com/dashboard](https://supabase.com/dashboard)**.
2. Click **New project** (or select your organization).
3. Fill in the project details:
   - **Name**: `wedinvites-prod` (or `wedinvites`)
   - **Database Password**: Set a strong password (e.g., generated with letters, numbers, and symbols). **⚠️ Save this password somewhere safe! You will need it in your connection strings.**
   - **Region**: Select **South Asia (Mumbai) - `ap-south-1`** *(Crucial for lowest latency across India for your couples & guests)*.
   - **Pricing Plan**: Free (or Pro).
4. Click **Create new project** and wait ~1–2 minutes while Supabase provisions the PostgreSQL database.

---

## 🔑 Step 2: Get Your Connection Strings (New Dashboard UI)

Once your project status shows **Active**:

### Method A: Via the "Connect" Button (Easiest)
1. At the top of your Supabase dashboard, click the **Connect** button (next to Project Settings).
2. Under **Type of connection**, choose **ORM** &rarr; Select **Prisma**.
3. Toggle the option to **Show connection pooling**.
4. You will see both:
   - **`DATABASE_URL`** (Transaction / Pooled mode on Port `6543`).
   - **`DIRECT_URL`** (Direct mode on Port `5432`).
5. Replace `[YOUR-PASSWORD]` with the actual database password you chose in Step 1.

### Method B: Via Project Settings &rarr; Database
1. In the left navigation, click **Project Settings (⚙️)** &rarr; **Database**.
2. Scroll down to **Connection parameters** / **Connection string**:
   - **URI Tab**:
     - Choose **Session** (Port 5432) &rarr; This is your `DIRECT_URL`.
     - Choose **Transaction** (Port 6543) &rarr; This is your `DATABASE_URL` (add `?pgbouncer=true` at the end).

---

## 📝 Step 3: Update `.env` File

Open your project's `.env` file (and `.env.production` on your VPS):

```env
# ==============================================================================
# 🗄️ 2. SUPABASE POSTGRESQL DATABASE & PRISMA CONFIGURATION (PRODUCTION)
# ==============================================================================
DATABASE_URL="postgresql://postgres.[NEW-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[NEW-PROJECT-REF].supabase.co:5432/postgres"
```

> [!TIP]
> If your database password contains special characters (like `#`, `@`, `$`, `&`), ensure the entire string is wrapped in double quotes `""` in `.env` to prevent truncation.

---

## ⚡ Step 4: Push Prisma Schema (Create All Tables)

Once you update your `.env`, run this command in your local terminal to automatically create all tables (`users`, `accounts`, `invitations`, `orders`, `guest_messages`, etc.) in your new database:

```bash
# Push the schema to create all tables in the new Supabase database
npx prisma db push

# Re-generate Prisma Client
npx prisma generate
```

You should see:
```text
🚀 Your database is now in sync with your Prisma schema. Done in ...ms
✔ Generated Prisma Client
```

---

## 🧪 Step 5: Verify the Connection

We have a built-in verification script in your project! Run:

```bash
node --env-file=.env scripts/test-supabase.mjs
```

You will see:
```text
--------------------------------------------------
🔍 Testing Supabase PostgreSQL Database Connection...
--------------------------------------------------
📡 Connecting to: postgresql://postgres.***:...
✅ SUCCESS: Connection Established with Supabase!
⏱️ Response Time: 78ms
🗄️ Database Name: postgres
📋 Current Tables in 'public' schema:
   - accounts
   - guest_messages
   - invitations
   - orders
   - sessions
   - users
   - verification_tokens
🎉 Supabase Database is ready and operational!
```

---

## 📦 Step 6: (Optional) Migrate Existing Data from Personal to New Account

If you have existing test couples, orders, or invitations in your old personal Supabase that you want to transfer to the new production database:

### Option 1: Using pg_dump and psql (Command Line)
```bash
# 1. Export data from old Supabase database
pg_dump "postgresql://postgres:oldpassword@db.old-project-ref.supabase.co:5432/postgres" --data-only --schema=public -f wedinvites_backup.sql

# 2. Import data into new Supabase database
psql "postgresql://postgres:newpassword@db.new-project-ref.supabase.co:5432/postgres" -f wedinvites_backup.sql
```

### Option 2: Start Fresh (Clean Production)
If your previous data was just testing/mock data, simply running `npx prisma db push` (Step 4) gives you a clean, pristine production database ready for real paying customers.

---

## 🖥️ Step 7: Update Your Production Server (VPS)

When you deploy to your Ubuntu VPS:

1. SSH into your VPS:
   ```bash
   ssh root@<YOUR_VPS_IP>
   ```
2. Navigate to your project folder:
   ```bash
   cd /var/www/wedinvites
   ```
3. Update `.env`:
   ```bash
   nano .env
   ```
   Paste the new `DATABASE_URL` and `DIRECT_URL`.
4. Run Prisma push on the server:
   ```bash
   npx prisma db push
   ```
5. Restart PM2:
   ```bash
   pm2 restart wedinvites
   ```
6. Check logs:
   ```bash
   pm2 logs wedinvites
   ```

---

## 🛡️ Production Recommendations for Supabase

1. **Disable Project Pausing (Free Tier)**:
   - Supabase free-tier projects pause automatically after 7 days of inactivity.
   - For a production business like WedInvites, upgrading to the **Supabase Pro tier ($25/mo)** guarantees:
     - Zero pausing (always online).
     - Daily automated backups with 7-day retention.
     - 8 GB database storage and 100,000 monthly active users.
2. **Connection Pooling**:
   - Always use the **Port 6543** connection string (`?pgbouncer=true`) for your Next.js application runtime to prevent connection exhaustion.
   - Use the **Port 5432** direct string (`DIRECT_URL`) only for Prisma CLI migrations.
