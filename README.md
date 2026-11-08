<div align="center">

# Agricultural Engineering Platform

**A free, Arabic-first learning platform for the Faculty of Agricultural Engineering, Al-Azhar University**

Course library · Gamified learning path · Student dashboard · Faculty directory · Alumni community · Graduation projects · Admin panel

[English](README.md) · [العربية](README.ar.md)

</div>

<!-- Tip: add a screenshot here, e.g. ![Home page](docs/screenshots/home.png) -->

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Navigation](#navigation)
- [Architecture](#architecture)
- [Engineering Highlights](#engineering-highlights)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Security](#security)
- [Tech Stack](#tech-stack)

## Overview

Students of the faculty previously had no single place for lectures, files, progress tracking and academic resources. This platform brings them together in one fast, mobile-friendly, right-to-left interface, and gives administrators a built-in panel to manage every piece of content without touching code.

It is deliberately lightweight: plain HTML, CSS and JavaScript with **no build step**, hosted as static files on GitHub Pages. Data and authentication run on **Supabase** (PostgreSQL with Row Level Security), and large files are served from **Cloudflare R2**.

## Features

| Area | What it does |
|---|---|
| **Course Library** | Departments, subjects, materials and files, with search and an AI study assistant (Supabase Edge Function). |
| **Learning Path** | Rooms and tasks with server-side progress and points. Task content is stored as structured JSONB blocks (headings, images, galleries, video, tables, links, quotes). |
| **Student Dashboard** | Personal goals, subject progress and notes, tied to the user's account and protected by RLS. |
| **Faculty Directory** | Searchable, filterable staff profiles. |
| **Students & Alumni Community** | Member directory with an image viewer. |
| **Graduation Projects** | Archive with search, filters and sorting, plus a detail page per project. |
| **Admin Panel** | Full CRUD for subjects, files, rooms, tasks, questions, faculty, community, graduation projects and admins. Restricted to verified admin emails. |
| **Authentication** | Email/password and Google sign-in, email confirmation, password reset, and safe return-to-page after login. |
| **Theming & Accessibility** | Dark/light mode without flash on load, full RTL support, Cairo typeface, keyboard-accessible navigation with ARIA. |

## Navigation

The main header organizes eight pages into two dropdown menus on desktop, and two collapsible sections inside a side drawer on mobile.

| Platform & Services | Academic Community |
|---|---|
| Home | Faculty Members |
| Student Dashboard | Students & Alumni Community |
| Tools | Graduation Projects |
| Learning Path | Contact Us (WhatsApp) |

It follows a "premium glass" visual style, works with mouse, touch and keyboard (Tab, Enter, Arrow keys, Home/End, Escape), closes on outside click, and clearly marks the current page.

## Architecture

```
Browser  (static HTML / CSS / JS on GitHub Pages)
   │
   ├── js/auth.js      single Supabase client + all authentication flows
   ├── js/header.js    header, dropdowns, mobile drawer, theme
   ├── js/config.js    the only file that defines the Supabase project
   │
   ▼
Supabase       PostgreSQL + Row Level Security · Auth · Edge Functions · RPC
Cloudflare R2  large files
```

## Engineering Highlights

- **Security enforced in the database.** The browser holds only a publishable key; access is controlled by Row Level Security. Task completion and points are written exclusively through the `complete_task` RPC, and identity and points are derived from the session and the `tasks` table, never trusted from the client.
- **Admin authorization in PostgreSQL.** `is_admin()` checks a verified email against `admin_emails`, and is reused by both the admin panel and the RLS policies.
- **Single source of truth.** One Supabase client per page, one auth subscription, one config file, one header implementation shared across pages.
- **XSS hardening.** All database text is escaped, all URLs are restricted to http/https, and no data is written into inline event handlers.
- **Modular and isolated.** Each feature lives in its own folder with a CSS prefix (`rm-`, `gp-`, `sw-`) to prevent style collisions.
- **Admin panel built as an engine.** A generic CRUD core (router, repository, safe HTML templating) where each table is a small declarative module.
- **No build tooling to maintain.** Easy to fork, audit and deploy on any static host.
- **Operational care.** A scheduled GitHub Action keeps the free-tier Supabase project active, and the repository includes UI and logic test scripts in `tests-report/`.

## Project Structure

| Path | Purpose |
|---|---|
| `index.html`, `js/`, `css/` | Home app, shared scripts and styles (`variables.css` defines the theme). |
| `about/` | Learning path: room list and room view. |
| `student_dashboard/` | Student dashboard (compiled Tailwind output included). |
| `faculty/`, `community/`, `graduation/` | Directory, community and projects modules. |
| `tools/` | Tools page and a standalone study timer. |
| `admin/` | Admin panel. |
| `database/` | SQL for tables, policies, admin setup and the points system. |
| `docs/` | Authentication setup guide and Arabic email templates. |
| `tests-report/` | UI and logic test scripts with results. |
| `.github/workflows/` | Scheduled Supabase keep-alive job. |

## Getting Started

1. Clone the repository.
2. Create a Supabase project and paste its **Publishable Key** into `SUPABASE_KEY` in `js/config.js`.
3. In the Supabase SQL Editor, run `database/admin/001_admin_setup.sql`, then `002_add_admin.sql` (set your own email first), then the scripts for the features you need (for example `faculty_members.sql`, `community_members.sql`, `student_dashboard.sql`, `rooms_progress.sql`, `database/graduation/001_graduation_projects.sql`).
4. Configure Google sign-in, SMTP and redirect URLs by following `docs/auth-setup.md`.
5. Serve the folder with any static server, or publish it with GitHub Pages.

To rebuild the student dashboard styles after adding Tailwind classes:

```bash
cd student_dashboard
npm install
npm run build:css
```

> The site is served from a sub-path, so always use **relative** links between pages.

## Security

- Never commit a `service_role` key or any other secret. Only publishable keys belong in this repository.
- Every new table needs Row Level Security policies before it is exposed.
- The AI assistant uses its own project key, separate from the site database.

## Tech Stack

HTML5 · CSS3 (custom properties, RTL) · Vanilla JavaScript · Supabase (Auth, PostgreSQL, RLS, RPC, Edge Functions) · Cloudflare R2 · GitHub Pages · GitHub Actions · Tailwind CSS (dashboard only)
