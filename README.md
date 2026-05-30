# 💅 Tati's Nails — Complete Setup Guide

A production-ready website for Tati's custom handcrafted press-on nail business.
Built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

---

## 🗂️ Project Structure

```
tatis-nails/
├── app/
│   ├── page.tsx                          # Home page
│   ├── gallery/page.tsx                  # Gallery with category filters
│   ├── order/page.tsx                    # Multi-step order form
│   ├── order/confirmation/[orderId]/     # Order confirmation
│   ├── my-orders/page.tsx                # Customer order tracking
│   ├── dashboard/page.tsx                # Admin dashboard (password protected)
│   └── api/orders/route.ts               # Order API (submit + fetch)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── home/                             # Hero, FeaturedDesigns, HowItWorks, Testimonials, CTA
│   └── order/OrderForm.tsx               # 4-step order form
├── lib/
│   ├── types.ts                          # All TypeScript types + label maps
│   ├── utils.ts                          # Helper functions
│   ├── email.ts                          # Email templates (Nodemailer)
│   └── supabase/
│       ├── client.ts                     # Browser Supabase client
│       └── server.ts                     # Server Supabase client + admin client
└── supabase/
    └── schema.sql                        # Complete DB schema + seed data
```

---

## 🚀 Step-by-Step Launch Guide

### Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **"New project"** and name it `tatis-nails`.
3. Choose a strong database password and save it somewhere safe.
4. Wait ~2 minutes for the project to provision.

### Step 2 — Set Up the Database

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar.
2. Click **"New query"**.
3. Open `supabase/schema.sql` from this project and paste the entire contents.
4. Click **"Run"** (or press `Cmd+Enter`).
5. You should see **"Success"** — your tables, policies, and storage buckets are created.

### Step 3 — Get Your Supabase Keys

1. In Supabase, go to **Settings → API**.
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4 — Set Up Email (Gmail)

1. Use a Gmail account for the business (e.g. `tatisnails@gmail.com`).
2. Go to [myaccount.google.com](https://myaccount.google.com) → **Security**.
3. Enable **2-Step Verification** (required for app passwords).
4. Go to **Security → App passwords**.
5. Create a new app password — name it "Tati's Nails".
6. Copy the 16-character password shown → `EMAIL_APP_PASSWORD`.

### Step 5 — Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in all values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

EMAIL_FROM=tatisnails@gmail.com
EMAIL_USER=tatisnails@gmail.com
EMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

OWNER_EMAIL=tatisnails@gmail.com

ADMIN_PASSWORD=YourStrongPassword123!

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 6 — Install & Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the site!

**Test pages:**
- `/` — Home page
- `/gallery` — Gallery (shows placeholders until you add photos)
- `/order` — 4-step order form
- `/my-orders` — Customer order tracking
- `/dashboard` — Admin dashboard (use the `ADMIN_PASSWORD` you set)

---

## 🌐 Deploy to Vercel (Free)

### Step 1 — Push to GitHub

```bash
# Initialize git (if you haven't)
git init
git add .
git commit -m "Initial commit — Tati's Nails"

# Create a GitHub repo at github.com and push
git remote add origin https://github.com/your-username/tatis-nails.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"New Project"** → import your `tatis-nails` repo.
3. Vercel auto-detects Next.js. Click **"Deploy"**.

### Step 3 — Add Environment Variables on Vercel

1. In Vercel, go to your project → **Settings → Environment Variables**.
2. Add all the variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `EMAIL_FROM`
   - `EMAIL_USER`
   - `EMAIL_APP_PASSWORD`
   - `OWNER_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` ← set this to your Vercel URL, e.g. `https://tatis-nails.vercel.app`

3. Click **"Redeploy"** to apply the new env vars.

### Step 4 — Custom Domain (Optional but recommended)

1. Buy a domain like `tatisnails.com` from [Namecheap](https://namecheap.com) (~$12/year).
2. In Vercel → **Settings → Domains** → add your domain.
3. Follow the DNS instructions Vercel provides.
4. Update `NEXT_PUBLIC_APP_URL` in Vercel to your custom domain.

---

## 📸 Adding Real Gallery Photos

1. In Supabase dashboard → **Storage → gallery-images**.
2. Upload your nail photos (JPG/PNG recommended, 800×1200px minimum).
3. Click the uploaded file → copy the **Public URL**.
4. In Supabase → **Table Editor → gallery** → add rows with:
   - `title` — name of the design
   - `image_url` — the Public URL you copied
   - `category` — one of: `short`, `medium`, `long`, `special-occasion`, `seasonal`, `custom-art`
   - `is_featured` — `true` to show on homepage
   - `sort_order` — number for ordering (lower = first)

---

## 🔒 Admin Dashboard

- URL: `yourdomain.com/dashboard`
- Password: whatever you set in `ADMIN_PASSWORD`
- From the dashboard you can:
  - View all incoming orders
  - See customer details + inspiration photos
  - Update order status (New → In Progress → Ready → Completed)
  - Export orders as CSV
  - Search by name, email, or order number

---

## ✅ Launch Checklist

Before going live, verify:

- [ ] Supabase schema ran successfully (no errors)
- [ ] Test order submits successfully in dev
- [ ] Confirmation email arrives in your inbox
- [ ] Notification email arrives at `OWNER_EMAIL`
- [ ] Admin dashboard login works
- [ ] Gallery shows your photos (upload at least 6)
- [ ] Mobile layout looks good (test on your phone)
- [ ] Custom domain connected on Vercel
- [ ] `NEXT_PUBLIC_APP_URL` updated to production URL
- [ ] Share the link! 🎉

---

## 💡 Customization Tips

**Change brand colors:**
Edit `tailwind.config.ts` — the `nude` and `champagne` color palettes.

**Update Instagram handle:**
Edit `components/Footer.tsx` — change `@tatisnails` and the href.

**Add testimonials:**
In Supabase → `testimonials` table → add rows, set `is_approved = true`.

**Embed Instagram feed:**
Sign up at [Elfsight](https://elfsight.com) for a free Instagram widget and paste the embed code into `components/home/CTASection.tsx` or a new section.

**Add Google Analytics:**
Install `@next/third-parties` and add `<GoogleAnalytics gaId="G-XXXXX" />` to `app/layout.tsx`.

---

## 🆘 Troubleshooting

**Emails not sending?**
- Double-check your Gmail App Password (must be from Security → App Passwords, NOT your regular password)
- Make sure 2FA is enabled on the Gmail account
- Check Vercel function logs for error messages

**Supabase upload errors?**
- Make sure storage buckets were created (check Supabase → Storage)
- Verify your `SUPABASE_SERVICE_ROLE_KEY` is correct (the long one, not anon key)

**Orders not saving?**
- Check Vercel logs (Vercel dashboard → your project → Functions tab)
- Verify all env vars are set correctly in Vercel

**Images not showing?**
- Ensure `next.config.ts` includes the `*.supabase.co` remote pattern
- Make sure the storage bucket is set to **Public**

---

*Built with 💅 for Tati's Nails*
