# Stratosphere — Global Intelligence & Policy Analysis Platform

## Overview

Stratosphere is a dual-platform geopolitical intelligence hub designed for policymakers, analysts, and researchers who need timely, rigorous coverage of global affairs. The platform combines fast-paced daily analysis with in-depth policy research under a single unified codebase.

**Stratosphere Wire** is the daily analysis journal — a dark-themed, newsroom-style publication covering breaking geopolitical developments, regional flashpoints, and thematic trends across defense, energy, geoeconomics, and more.

**Stratosphere Institute** is the long-form policy research arm — a scholarly platform for policy briefs, research papers, and fellow profiles, presented in a refined academic aesthetic.

The platform is built with **Next.js 14** (App Router), **Neon PostgreSQL**, **NextAuth** for admin authentication, and **Tailwind CSS** for styling.

## Live Demo

[Stratosphere Wire](#) | [Stratosphere Institute](#) | [Admin Portal](#)

> Update these placeholder links with your deployed URLs.

## Platform Structure

Both Wire and Institute share a single Next.js application, database, and admin panel. Content is distinguished by the `section` field on each article (`wire` or `institute`).

```
┌─────────────────────────────────────────────────┐
│              Stratosphere Platform              │
├─────────────────────┬───────────────────────────┤
│   Stratosphere Wire │   Stratosphere Institute  │
│   /wire             │   /institute              │
│   Daily analysis    │   Policy briefs & papers  │
│   Regional coverage │   Fellow profiles         │
│   Expert directory  │   Research publications   │
├─────────────────────┴───────────────────────────┤
│         Shared: Admin · Database · Auth         │
└─────────────────────────────────────────────────┘
```

## Tech Stack

| Category     | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 14 (App Router)             |
| Database     | Neon PostgreSQL (serverless)        |
| Auth         | NextAuth v5 (Credentials provider)  |
| Styling      | Tailwind CSS + shadcn/ui            |
| Maps         | Leaflet + react-leaflet             |
| Charts       | Recharts                            |
| Deployment   | Netlify                             |

## Features

### Wire

- Daily geopolitical analysis articles with markdown rendering
- Browse by region (Indo-Pacific, Euro-Atlantic, MENA, and more)
- Browse by topic (Geoeconomics, Defense & Security, Energy Policy, etc.)
- Expert/analyst profile pages
- Featured article spotlight on homepage
- Dark newsroom UI with hover navigation dropdowns

### Institute

- Long-form policy briefs and research papers
- Fellow and analyst directory
- Browse publications by research area and region
- Scholarly serif typography and warm academic aesthetic
- PDF download support for research papers

### Shared

- Unified admin panel for content management
- Newsletter subscriber management
- Region and topic taxonomy shared across both sections
- Responsive design with mobile navigation
- SEO-friendly slug-based routing

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A [Neon](https://neon.tech) account (free tier works)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/stratosphere.git
   cd stratosphere
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**

   Copy the example below into a `.env.local` file at the project root:

   ```env
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   NEXTAUTH_SECRET=your-random-32-char-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ADMIN_EMAIL=admin@stratosphere.com
   ADMIN_PASSWORD=your-secure-password-here
   ```

4. **Run database migrations**

   ```bash
   npm run migrate
   ```

5. **Seed the database**

   ```bash
   npm run seed
   ```

   This creates the default admin user, sample regions, topics, analysts, and articles.

6. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable           | Purpose                                      | Example Format                                      |
|--------------------|----------------------------------------------|-----------------------------------------------------|
| `DATABASE_URL`     | Neon PostgreSQL connection string            | `postgresql://user:pass@host/db?sslmode=require`    |
| `NEXTAUTH_SECRET`  | JWT signing secret for admin sessions        | Random 32+ character string                         |
| `NEXTAUTH_URL`     | Base URL for NextAuth callbacks              | `http://localhost:3000` or your production URL      |
| `ADMIN_EMAIL`      | Default admin email (used by seed script)    | `admin@stratosphere.com`                            |
| `ADMIN_PASSWORD`   | Default admin password (used by seed script) | Strong password string                              |

> These are example formats only. Never commit real credentials to version control.

## Database Schema

The platform uses eight PostgreSQL tables:

| Table                    | Purpose                                                        |
|--------------------------|----------------------------------------------------------------|
| `users`                  | Admin accounts with hashed passwords                           |
| `analysts`               | Expert profiles (name, bio, photo, social links)                 |
| `regions`                | Geographic taxonomy (Indo-Pacific, MENA, etc.)                 |
| `topics`                 | Thematic taxonomy (Geoeconomics, Defense, etc.)                |
| `articles`               | All content for Wire and Institute sections                    |
| `article_regions`        | Many-to-many junction linking articles to regions              |
| `article_topics`         | Many-to-many junction linking articles to topics               |
| `newsletter_subscribers` | Email list for newsletter signups                              |

## Admin Panel

Access the admin portal at `/admin/login`.

**Default credentials** (created by the seed script):

- Email: `admin@stratosphere.com`
- Password: (set via `ADMIN_PASSWORD` environment variable)

> Change the default password immediately after first login in production.

From the admin panel you can:

- Create, edit, publish, and delete articles (Wire and Institute)
- Toggle featured article status
- Manage analyst/expert profiles
- View and manage newsletter subscribers
- Access the dashboard with content overview

## Deployment

### Netlify

1. Push your repository to GitHub.
2. Connect the repo in the [Netlify dashboard](https://app.netlify.com).
3. Set the following environment variables in **Site settings → Build & deploy → Environment → Environment variables**:

   **Required Variables:**
   - `DATABASE_URL` - Your Neon PostgreSQL connection string (format: `postgresql://user:pass@host/db?sslmode=require`)
   - `NEXTAUTH_SECRET` - Random 32+ character string for JWT signing
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://your-site.netlify.app`)
   - `ADMIN_EMAIL` - Admin email address
   - `ADMIN_PASSWORD` - Admin password

   **Getting your DATABASE_URL from Neon:**
   - Go to your Neon dashboard
   - Select your project
   - Copy the connection string from the "Connection Details" tab
   - Ensure it includes `?sslmode=require` at the end

4. Set the Node version in **Site settings → Build & deploy → Environment → Environment variables**:
   - Key: `NODE_VERSION`
   - Value: `20`

5. Netlify will auto-deploy on every push to your main branch.

The project includes a pre-configured `netlify.toml` with the Next.js plugin and Node 20.

**Troubleshooting Netlify Deploy:**
- If you see "No database connection string was provided to `neon()`", ensure `DATABASE_URL` is set in Netlify environment variables
- The DB connection uses lazy initialization to prevent build-time connection attempts
- All database queries are executed at runtime, not during the build process

### Neon Database

- Create a free Neon project and copy the connection string to `DATABASE_URL`.
- Run `npm run migrate` locally against your production database before the first deploy, or add it as a build step.
- Run `npm run seed` once to populate initial data.

## Project Structure

```
app/           Next.js App Router pages, layouts, and server actions
components/    React components (wire/, institute/, admin/, ui/)
lib/           Database client, auth, queries, migrations, and seed scripts
types/         Shared TypeScript type definitions
```

## Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a pull request. Follow existing code conventions and ensure the project builds cleanly before opening a PR.

## License

MIT License
