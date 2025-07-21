# Employment Management System (EMS)

A **Basic full‑stack Employment Management System** built with **Go Lang** for the backend API and **React + TypeScript** for the frontend SPA. EMS lets organisations manage roles, departments, employees and view analytics through an interactive dashboard.

---

## ✨ Features

| Area            | Capability                                                                                |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Roles**       | Create ▪️ Read ▪️ Update ▪️ Delete role definitions                                       |
| **Departments** | CRUD departments, assign managers & headcount limits                                      |
| **Employees**   | CRUD employees, role + department mapping, status tracking                                |
| **Analytics**   | Dashboard with department size, active/ inactive counts, hiring trends & pie / bar charts |
| **Auth**        | Login, JWT cookie‑based sessions, protected admin routes                                  |
| **CORS**        | Custom middleware using Go for fine‑grained domain control                                |

---

## 🏗 Tech Stack

| Layer        | Tech                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| **Frontend** | React 18, TypeScript 5, React‑Router 6, Tailwind CSS, Toastify (notifications) |
| **Backend**  | Go 1.22, `net/http`, `go-sql-driver/mysql`,                                    |
| **Database** | MySQL 8 (InnoDB)                                                               |

---

## 📐 Architecture

```
┌────────────┐        REST           ┌──────────────┐
│ React SPA  │  ───────────────▶    │  Go API      │
│ (TS)       │   JSON / JWT cookies │  (mux)       │
└────────────┘ ◀───────────────     │              │
        ▲                           │  MySQL       │
        │                           └──────────────┘
```

- **Frontend** served by Vite in dev.
- **Backend** compiles to a single binary; all routes under `/api/v1`.

---

## 🚀 Quick Start

### 1 · Clone & Init

```bash
# clone
$ git clone https://github.com/kiddo9/EMS.git && cd ems

```

### 2 · Backend (Go)

```bash
$ cd server
# install deps & generate swagger docs
$ go mod tidy

```

Backend runs on **:`8080`** by default.

### 3 · Frontend (React + TS)

```bash
$ cd client
$ npm i
$ npm run dev      # Vite dev server on :5173
```

---

## 🌐 API Endpoints (excerpt)

| Method   | Route                 | Description                    |
| -------- | --------------------- | ------------------------------ |
| `POST`   | `/roles`              | create role                    |
| `GET`    | `/roles`              | list roles                     |
| `PUT`    | `/roles/id?uuid=id`   | update role                    |
| `DELETE` | `/roles/id?uuid=id`   | delete role                    |
| `GET`    | `/analytics/overview` | aggregated stats for dashboard |

---

## 📄 License

MIT © 2025 kiddo
# EMS
