# CareerCracker AI 🚀

> **Ace Your Campus Placement** — An AI-powered aptitude preparation platform for Computer Engineering students targeting TCS, Infosys, HCL, Wipro, Cognizant, Capgemini & Accenture.

---

## ✨ Features

- 📚 **150+ Aptitude Questions** — Quantitative, Logical Reasoning, Verbal Ability
- 🏢 **7 Company-Specific Prep Tracks** — TCS NQT, Infosys InfyTQ, Wipro Elite, HCL CAT, Accenture, Cognizant GenC, Capgemini
- 💻 **Coding Arena** — 20+ problems with in-browser IDE (Monaco Editor), multi-language support
- ⏱️ **Mock Test Engine** — Timed tests with anti-cheat (tab-switch detection, fullscreen mode)
- 📊 **AI Analytics Dashboard** — Placement Readiness Score, weak topic analysis, progress tracking
- 🏆 **Leaderboard** — Compete with peers, track your rank
- 🎯 **Personalized Recommendations** — AI-powered study plan based on your performance

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (Access + Refresh tokens) |
| Code Execution | Node.js child_process sandbox |
| Charts | Recharts |
| Code Editor | Monaco Editor |

---

## 🚀 Quick Start (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Setup

```bash
git clone <repo-url>
cd CareerCrackerAI
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your MongoDB Atlas URI:
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/careercracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
JWT_REFRESH_SECRET=another-super-secret-key-at-least-32-characters
```

```bash
npm install
npm run seed      # Seeds 150+ questions, 20 coding problems, 15 tests
npm run dev       # Starts backend on http://localhost:5000
```

### 3. Configure Frontend

```bash
cd ../frontend
# .env.local is already configured for localhost
npm install
npm run dev       # Starts frontend on http://localhost:3000
```

### 4. Open the App

Visit [http://localhost:3000](http://localhost:3000)

**Demo Accounts:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@careercracker.ai | Admin@123 |
| Student | student@careercracker.ai | Student@123 |

---

## 🐳 Quick Start (With Docker)

```bash
# 1. Create .env file in project root
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET

# 2. Start all services
docker-compose up --build

# 3. Seed the database (first time only)
docker-compose exec backend npm run seed

# 4. Visit http://localhost
```

---

## 📁 Project Structure

```
CareerCrackerAI/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database connection
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Question.js
│   │   │   ├── Test.js
│   │   │   ├── TestAttempt.js
│   │   │   ├── CodingProblem.js
│   │   │   └── CodingSubmission.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── questions.js
│   │   │   ├── tests.js
│   │   │   ├── coding.js
│   │   │   ├── analytics.js
│   │   │   └── admin.js
│   │   ├── middleware/        # Auth, error handling
│   │   ├── utils/             # Code executor, analytics helpers
│   │   └── seed/              # Database seeding scripts
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # Next.js 14 App
│   ├── app/                   # App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/              # Login, Register
│   │   ├── dashboard/         # Student dashboard
│   │   ├── practice/          # Aptitude practice
│   │   ├── mock-tests/        # Mock test engine
│   │   ├── coding/            # Coding arena
│   │   ├── companies/         # Company prep
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── leaderboard/       # Leaderboard
│   │   └── admin/             # Admin panel
│   ├── components/            # Reusable components
│   ├── lib/                   # API client, utilities
│   └── types/                 # TypeScript types
│
├── infrastructure/
│   └── nginx/
│       └── nginx.conf         # Reverse proxy config
│
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | List questions (filter by category/difficulty) |
| GET | `/api/questions/random` | Get N random questions |
| POST | `/api/questions` | Create question (admin) |

### Tests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tests` | List mock tests |
| POST | `/api/tests/:id/start` | Start a test attempt |
| POST | `/api/tests/:id/submit` | Submit test attempt |

### Coding
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coding/problems` | List coding problems |
| POST | `/api/coding/run` | Run code (sandbox) |
| POST | `/api/coding/submit` | Submit against test cases |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Full analytics profile |
| GET | `/api/analytics/leaderboard` | Top 50 students |

---

## 🎨 Design System

- **Primary Background**: `#0a0a0f` (near black)
- **Cards**: Glassmorphism with `backdrop-blur` and `rgba(18,18,31,0.8)`
- **Accent**: Purple `#7c3aed` → Blue `#2563eb` gradient
- **Font**: Inter (Google Fonts)
- **Mode**: Dark (primary), Light mode planned

---

## 🔒 Security

- JWT with RS256-style signing (configurable)
- Bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min for API, 10 req/15min for auth)
- CORS restricted to frontend URL
- Helmet.js security headers
- Input validation with express-validator
- Code execution in isolated child_process with 5s timeout

---

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-generated personalized test papers
- [ ] Resume ATS analyzer
- [ ] Discussion forum
- [ ] Email notifications
- [ ] Webcam-based proctoring
- [ ] Voice-based aptitude tests
- [ ] Placement prediction ML model

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — Built with ❤️ for engineering students

---

**CareerCracker AI** | [careercracker.ai](https://careercracker.ai) | Crack Your Placement 🎯
