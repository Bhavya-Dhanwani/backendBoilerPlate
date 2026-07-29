# 🚀 create-backend-app

**Generate a production-ready Express backend in under 60 seconds.**

A powerful CLI tool that scaffolds fully-configured Express.js backends with clean architecture, JWT authentication, Google OAuth, Docker support, and zero npm audit vulnerabilities — right out of the box.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Language** | TypeScript (strict) or JavaScript |
| **Module System** | ES Modules (`import/export`) or CommonJS (`require`) |
| **Architecture** | Modular (domain-driven) or MVC |
| **Programming Style** | Class Based (ES6 classes) or Function Based (pure/async functions) |
| **Authentication** | JWT signup, login, logout with access + refresh tokens |
| **Google OAuth 2.0** | Credential login + redirect/callback flow |
| **Email Verification** | OTP-based email verification via Nodemailer |
| **Forgot Password** | Reset token + magic link email flow |
| **Database** | MongoDB with Mongoose ODM |
| **Logger** | Pino (structured JSON) or console.log |
| **API Docs** | Swagger UI at `/docs` |
| **Testing** | Jest + Supertest with health check spec |
| **Docker** | Dockerfile, docker-compose.yml, watch-package script |
| **Code Comments** | Optional step-by-step inline documentation |
| **0 Vulnerabilities** | Clean `npm audit` with zero warnings or vulnerabilities |

---

## 📦 Quick Start

```bash
npx create-backend-app
```

Or install globally:

```bash
npm install -g create-backend-app
create-backend-app
```

Then follow the interactive prompts:

```
======================================================
  🚀 CREATE-BACKEND-APP — Backend Boilerplate Generator
======================================================
  Production-ready Express backend in under 60 seconds

? Project name › my-backend
? Choose a setup › Recommended / Custom / Reuse Previous
```

---

## 🛠️ Setup Modes

### ⚡ Recommended (One Click)
Scaffolds with industry-standard defaults:
- TypeScript • ES Modules • Modular • Class Based
- Multi Token Auth • Google OAuth • Email Verification • Forgot Password
- MongoDB • Pino Logger • Swagger • Jest • Docker

### 🔧 Custom (Step-by-Step)
Choose every layer of your backend:

```
? Language           → TypeScript / JavaScript
? Module System      → ES Modules / CommonJS
? Folder Structure   → Modular / MVC
? Programming Style  → Class Based / Function Based
? Authentication     → Yes / No
  ├─ Token Strategy  → Multi Token / Single Token
  ├─ Email Verify    → Yes / No
  ├─ Forgot Password → Yes / No
  └─ Google Auth     → Yes / No
? Database           → MongoDB (Mongoose)
? Logger             → Pino / None
? API Docs           → Swagger / None
? Testing            → Jest / None
? Code Comments      → Yes / No
? Docker             → Yes / No
? Install Deps       → Yes / No
```

### 🔁 Reuse Previous
Your last configuration is saved automatically. Pick "Reuse Previous" to scaffold instantly with the same settings.

---

## 📁 Generated Project Structure

### Modular Architecture (Domain-Driven)

```
my-backend/
├── .gitignore
├── server/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── eslint.config.js
│   ├── prettier.config.js
│   ├── jest.config.js
│   ├── README.md
│   ├── server.ts
│   └── src/
│       ├── app.ts
│       ├── __tests__/
│       │   └── health.test.ts
│       ├── modules/
│       │   └── public/
│       │       └── auth/
│       │           ├── auth.controller.ts
│       │           ├── auth.router.ts
│       │           ├── auth.validator.ts
│       │           └── auth.types.ts
│       └── shared/
│           ├── config/
│           │   ├── env.config.ts
│           │   ├── db.config.ts
│           │   ├── logger.config.ts
│           │   └── mail.config.ts
│           ├── constants/
│           │   ├── env.constants.ts
│           │   ├── StatusCodes.constants.ts
│           │   └── tokens.constants.ts
│           ├── dao/
│           │   ├── user.dao.ts
│           │   ├── session.dao.ts
│           │   └── token.dao.ts
│           ├── errors/
│           │   ├── BadRequest.error.ts
│           │   ├── Unauthorized.error.ts
│           │   ├── Forbidden.error.ts
│           │   ├── NotFound.error.ts
│           │   └── Conflict.error.ts
│           ├── middlewares/
│           │   ├── index.middleware.ts
│           │   ├── auth.middleware.ts
│           │   ├── refresh.middleware.ts
│           │   ├── error.middleware.ts
│           │   ├── NotFound.middleware.ts
│           │   └── validate.middleware.ts
│           ├── models/
│           │   ├── user.model.ts
│           │   ├── sessions.model.ts
│           │   └── token.model.ts
│           ├── responses/
│           │   ├── Ok.response.ts
│           │   ├── Created.response.ts
│           │   └── NoContent.response.ts
│           ├── routers/
│           │   ├── index.router.ts
│           │   └── health.router.ts
│           ├── sanitizers/
│           │   └── user.sanitizer.ts
│           └── utils/
│               ├── ApiError.util.ts
│               ├── ApiResponse.util.ts
│               ├── buildTokenPayload.util.ts
│               ├── createSession.util.ts
│               ├── googleAuth.util.ts
│               ├── hashing.util.ts
│               ├── sendMail.util.ts
│               ├── token.util.ts
│               └── validateErrors.util.ts
├── Dockerfile              # (if Docker enabled)
├── docker-compose.yml      # (if Docker enabled)
└── .dockerignore            # (if Docker enabled)
```

---

## 🔐 Authentication Flow

### Multi Token Strategy (Recommended)
- **Access Token** — Short-lived JWT sent in response body
- **Refresh Token** — Long-lived JWT stored in httpOnly cookie
- **Session** — Server-side session stored in MongoDB

### Endpoints Generated

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/v1/auth/signup` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login with email/password |
| `GET` | `/api/v1/auth/me` | Get authenticated user profile |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `POST` | `/api/v1/auth/logout` | Logout (clear session) |
| `POST` | `/api/v1/auth/logout-all` | Logout from all sessions |
| `POST` | `/api/v1/auth/google/login` | Login via Google credential |
| `GET` | `/api/v1/auth/google/redirect` | Redirect to Google OAuth |
| `GET` | `/api/v1/auth/google/callback` | Google OAuth callback |
| `POST` | `/api/v1/auth/forgot-password` | Send password reset email |
| `POST` | `/api/v1/auth/reset-password` | Reset password with token |

---

## 🐳 Docker Support

When Docker is enabled, the generator creates:

- **`Dockerfile`** — Multi-stage production Node.js image
- **`docker-compose.yml`** — App + MongoDB containers with volumes
- **`.dockerignore`** — Optimized build context

```bash
# Start everything
docker-compose up --build

# Run in background
docker-compose up -d
```

---

## 🧪 Testing

Generated projects include a Jest test suite with:

- **Jest 30** with ES Modules support
- **Supertest** for HTTP endpoint testing
- Pre-configured health check test spec

```bash
npm test
```

---

## 📋 After Scaffolding

```bash
cd my-backend/server
npm install        # if not auto-installed
npm run dev        # start development server
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/my-backend
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Google OAuth (if enabled)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

---

## 🧹 Zero Warnings, Zero Vulnerabilities

Every generated project ships with npm overrides that guarantee:

```
found 0 vulnerabilities
```

No deprecation warnings. No audit issues. Clean from day one.

---

## 📄 License

MIT

---

<p align="center">
  Built with ❤️ to save developers from writing boilerplate.
</p>
