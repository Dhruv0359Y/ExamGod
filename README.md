# 🎓 ExamGod - AI Exam Predictor

An intelligent exam prediction system that analyzes historical exam patterns and generates predicted question papers with high-probability topics for board exams.

## 🌟 Features

- **Topic Probability Analysis**: Analyzes past exam papers to predict high-probability topics
- **Smart Paper Generation**: Creates board-standard question papers based on patterns
- **AI Explanations**: Provides detailed explanations for questions
- **Multiple Study Modes**: Pass Mode and Average Marks Mode
- **Multi-Subject Support**: Physics, Chemistry, Mathematics, Biology, etc.
- **Real-time Analysis**: Live data processing and caching for faster responses

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│                 │         │                  │         │              │
│   Frontend      │────────▶│    Backend       │────────▶│   MongoDB    │
│   (React +      │  REST   │    (Express +    │         │   (Cache)    │
│    TypeScript)  │   API   │    Gemini AI)    │         │              │
│                 │         │                  │         │              │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

### Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS

**Backend:**
- Node.js
- Express 5
- MongoDB (with Mongoose)
- Google Gemini AI
- CORS enabled

## 📁 Project Structure

```
examgod/
├── backend/
│   └── backend/
│       ├── src/
│       │   ├── controllers/      # Request handlers
│       │   ├── services/         # Business logic
│       │   ├── routes/           # API routes
│       │   ├── models/           # MongoDB schemas
│       │   ├── config/           # Configuration files
│       │   ├── data/             # JSON data files
│       │   │   ├── frequency/    # Topic frequency data
│       │   │   ├── questionBank/ # Question banks
│       │   │   └── raw/          # Raw exam papers
│       │   └── server.js         # Entry point
│       ├── package.json
│       └── .env
│
├── frontend/
│   ├── services/
│   │   ├── apiService.ts        # Backend API calls
│   │   └── geminiService.ts     # Direct Gemini calls (legacy)
│   ├── views/
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── Paper.tsx            # Question paper view
│   │   ├── Landing.tsx          # Landing page
│   │   ├── Selection.tsx        # Subject selection
│   │   └── Modes.tsx            # Study mode selection
│   ├── App.tsx
│   ├── types.ts
│   ├── package.json
│   └── .env
│
├── CONNECTION_GUIDE.md          # Detailed setup guide
├── start-dev.sh                 # Linux/macOS start script
└── start-dev.bat                # Windows start script
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running on port 27017)
- npm or yarn

### Option 1: Automated Setup (Recommended)

**For Linux/macOS:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**For Windows:**
```cmd
start-dev.bat
```

### Option 2: Manual Setup

1. **Start MongoDB**
   ```bash
   # macOS/Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

2. **Setup Backend**
   ```bash
   cd backend/backend
   npm install
   node src/server.js
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🔌 API Endpoints

### 1. Get High-Probability Topics
```http
POST /api/topics
Content-Type: application/json

{
  "subject": "physics",
  "mode": "pass"
}
```

**Response:**
```json
{
  "highProbabilityTopics": [
    {
      "topic": "Electromagnetic Induction",
      "probability": "92%",
      "weightage": "5-8 Marks",
      "explanation": "This topic has appeared in 18 out of 20 papers...",
      "hinglishSummary": "Ye topic bahut important hai...",
      "writingTips": [
        "Always draw proper diagrams",
        "Mention Faraday's law clearly"
      ]
    }
  ]
}
```

### 2. Generate Predicted Paper
```http
POST /api/paper
Content-Type: application/json

{
  "subject": "physics"
}
```

### 3. Get AI Explanation
```http
POST /api/explanation
Content-Type: application/json

{
  "subject": "physics",
  "questionText": "Explain electromagnetic induction",
  "marks": 5
}
```

## 📊 Data Flow

1. **User selects** grade, subject, and study mode
2. **Frontend requests** topics from backend API
3. **Backend analyzes** frequency data from JSON files
4. **AI processes** patterns and generates predictions
5. **MongoDB caches** generated papers for performance
6. **Frontend displays** results with interactive UI

## 🛠️ Configuration

### Backend Environment Variables (`.env`)
```env
MONGO_URI=mongodb://127.0.0.1:27017/ExamGod
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### Frontend Environment Variables (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/

# Get topics
curl -X POST http://localhost:5000/api/topics \
  -H "Content-Type: application/json" \
  -d '{"subject": "physics", "mode": "pass"}'
```

### Test Frontend
1. Open http://localhost:5173
2. Select Class 10 or Class 12
3. Choose subjects (Physics, Chemistry, etc.)
4. Select study mode
5. View predictions and generate papers

## 📝 Available Subjects

- **Class 10**: Science, Mathematics, Social Science, English
- **Class 12**: Physics, Chemistry, Mathematics, Biology

## 🎯 Study Modes

1. **Pass Mode**: Focuses on essential topics for passing (60-70%)
2. **Average Marks Mode**: Balanced approach for 70-85% marks

## 🔒 Security Notes

- API keys are stored in backend only
- CORS is enabled for development
- MongoDB credentials should be secured in production
- Environment variables should never be committed

## 🐛 Troubleshooting

### "Failed to fetch" Error
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is enabled in backend

### MongoDB Connection Failed
- Start MongoDB service
- Check MongoDB is running on port 27017
- Verify `MONGO_URI` in backend `.env`

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process on port 5173 (frontend)
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows
```

## 📚 Additional Documentation

- [Detailed Connection Guide](CONNECTION_GUIDE.md) - Complete setup instructions
- API Documentation - Available at `/api/docs` (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent predictions
- MongoDB for caching and performance
- React and Vite for modern frontend development


---


**Built with ❤️ for students preparing for board exams**
