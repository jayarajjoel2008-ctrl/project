# ABTalks

A full-stack application for daily AI challenge talks.

## Project Structure

```
abtalks/
├── backend/           # Node.js server
│   ├── server.js      # Express server
│   ├── package.json   # Backend dependencies
│   ├── .env          # Environment variables
│   └── data/
│       ├── challenges.json
│       └── users.json
├── frontend/          # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── LandingPage.js
│   │   │   ├── LandingPage.css
│   │   │   ├── Dashboard.js
│   │   │   ├── Dashboard.css
│   │   │   ├── ChallengeDay.js
│   │   │   └── ChallengeDay.css
│   │   └── utils/
│   │       └── helpers.js
│   ├── package.json
│   └── .env
└── README.md
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Features

- Daily AI challenges
- User dashboard
- Challenge tracking
