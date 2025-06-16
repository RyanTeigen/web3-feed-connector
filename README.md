# Social Feed Aggregator

A full-stack decentralized social media content aggregator with Metamask wallet authentication. The application consists of a FastAPI backend that aggregates content from Twitter/X, LinkedIn, Discord, and Ghost blogs, paired with a modern React frontend.

## 🏗️ Architecture

- **Backend**: FastAPI-based API server with social media scrapers
- **Frontend**: React + TypeScript with shadcn-ui components
- **Authentication**: Metamask wallet-based authentication
- **Platforms**: Twitter/X, LinkedIn, Discord, Ghost blogs

## 🚀 Quick Start

### Prerequisites
- Python 3.11+ (for backend)
- Node.js & npm (for frontend) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Docker (optional)
- Metamask wallet for testing
- API keys for social platforms

### Frontend Setup (Lovable Project)

**Option 1: Use Lovable (Recommended)**
1. Visit the [Lovable Project](https://lovable.dev/projects/b730f1f2-df0c-4ba3-9b2d-8eeea90cf7d9)
2. Start prompting to make changes
3. Changes are automatically committed to the repository

**Option 2: Local Development**
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

**Option 3: GitHub Codespaces**
1. Navigate to the main repository page
2. Click "Code" → "Codespaces" → "New codespace"
3. Edit files directly and commit changes

### Backend Setup

1. **Create backend directory structure:**
```bash
# Create project directory
mkdir social-feed-aggregator-backend
cd social-feed-aggregator-backend

# Create the directory structure
mkdir -p app/{models,services/{scrapers},api,utils}
touch app/__init__.py app/models/__init__.py app/services/__init__.py 
touch app/services/scrapers/__init__.py app/api/__init__.py app/utils/__init__.py
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Environment setup:**
```bash
cp .env.example .env
# Edit .env file with your API keys and settings
```

4. **Run the backend server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Setup (Backend)

```bash
# Using Docker Compose
docker-compose up --build

# Or manual Docker build
docker build -t social-feed-api .
docker run -p 8000:8000 --env-file .env social-feed-api
```

## 📋 API Endpoints

### Authentication
- `GET /api/v1/auth/wallet/message` - Get message to sign
- `POST /api/v1/auth/wallet/connect` - Connect wallet and get token
- `POST /api/v1/auth/verify` - Verify JWT token

### Feed
- `POST /api/v1/feed/` - Get aggregated feed (with body)
- `GET /api/v1/feed/` - Get aggregated feed (with query params)
- `GET /api/v1/feed/platforms` - Get available platforms status
- `POST /api/v1/feed/refresh` - Force refresh feed data

### System
- `GET /health` - Service health check
- `GET /` - API information

## 🔧 Configuration

### Backend Environment Variables

Key environment variables in `.env`:

```bash
# Required for production
JWT_SECRET_KEY=your-secure-secret-key
DISCORD_BOT_TOKEN=your_discord_bot_token
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Platform-specific
DISCORD_CHANNEL_IDS=["channel_id_1","channel_id_2"]
GHOST_BLOG_URL=https://yourblog.ghost.io
LINKEDIN_CLIENT_ID=your_linkedin_client_id
```

### Frontend Configuration

The frontend is configured through the Lovable platform and connects to the backend API endpoints.

## 🧪 Testing the Authentication Flow

1. **Get signature message:**
```bash
curl http://localhost:8000/api/v1/auth/wallet/message
```

2. **Sign the message with Metamask** (in your frontend)

3. **Authenticate:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/wallet/connect \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x...",
    "signature": "0x...",
    "message": "Sign this message to authenticate..."
  }'
```

4. **Use the token for feed requests:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/feed/
```

## 🛠️ Technology Stack

### Frontend
- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **JWT** - Authentication tokens
- **Docker** - Containerization

## 🚀 Deployment

### Frontend Deployment
1. Open [Lovable](https://lovable.dev/projects/b730f1f2-df0c-4ba3-9b2d-8eeea90cf7d9)
2. Click Share → Publish
3. For custom domains, use Netlify (see [Custom domains guide](https://docs.lovable.dev/tips-tricks/custom-domain/))

### Backend Deployment
- Deploy using Docker containers
- Configure environment variables for production
- Set up reverse proxy (nginx/Apache)
- Enable HTTPS with SSL certificates

## 🏗️ Development Roadmap

### Phase 1: Core Services (Priority: High)
1. **Authentication Service** (`app/services/auth_service.py`)
   - Wallet signature verification
   - JWT token generation/validation

2. **Feed Aggregator** (`app/services/aggregator.py`)
   - Coordinate all platform scrapers
   - Merge and sort posts by timestamp

### Phase 2: Platform Scrapers (Priority: High)
1. **Discord Scraper** (`app/services/scrapers/discord.py`) - Easiest to start with
2. **Ghost Blog Scraper** (`app/services/scrapers/ghost.py`) - Second easiest  
3. **Twitter Scraper** (`app/services/scrapers/twitter.py`) - More complex
4. **LinkedIn Scraper** (`app/services/scrapers/linkedin.py`) - Most complex

### Phase 3: Production Ready (Priority: Medium)
1. Rate limiting middleware
2. Logging and monitoring
3. Error handling improvements
4. Optional caching layer

## 📁 Project Structure

### Backend Structure
```
app/
├── main.py              # FastAPI app setup ✅
├── config.py            # Configuration management ✅
├── models/              # Pydantic models ✅
│   ├── auth.py         # Auth models ✅
│   ├── feed.py         # Feed models ✅
│   └── platform.py     # Platform models ✅
├── api/                # API endpoints ✅
│   ├── auth.py         # Auth endpoints ✅
│   └── feed.py         # Feed endpoints ✅
├── services/           # Business logic (TODO)
│   ├── auth_service.py # Auth service (TODO)
│   ├── aggregator.py   # Feed aggregator (TODO)
│   └── scrapers/       # Platform scrapers (TODO)
└── utils/              # Utilities ✅
    └── exceptions.py   # Custom exceptions ✅
```

### Frontend Structure
```
src/
├── components/         # React components
├── pages/             # Application pages
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── styles/            # CSS and styling
```

## 🚨 Important Notes

### Security
- **Backend**: Change `JWT_SECRET_KEY` in production
- **Frontend**: Configure CORS settings for production domains
- **Authentication**: Ensure proper wallet signature validation

### Rate Limits
- Respect platform API limits for all social media scrapers
- Implement rate limiting middleware in production

### Development
- **CORS**: Configure `ALLOWED_ORIGINS` for your frontend domain
- **Validation**: All inputs are validated with Pydantic (backend) and TypeScript (frontend)
- **Error Handling**: Both frontend and backend include comprehensive error handling

## 📚 Documentation & Resources

### API Documentation
- Interactive API docs: http://localhost:8000/docs
- ReDoc documentation: http://localhost:8000/redoc
- Health check: http://localhost:8000/health

### Frontend Resources
- [Lovable Documentation](https://docs.lovable.dev)
- [shadcn-ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

### Development Tools
- Frontend: Lovable platform for rapid development
- Backend: FastAPI automatic documentation
- Testing: Use the provided curl commands for API testing

## 🤝 Contributing

1. **Frontend**: Make changes through Lovable or clone the repository for local development
2. **Backend**: Follow the local development setup and create pull requests
3. **Full-stack**: Test integration between frontend and backend thoroughly
4. **Documentation**: Update this README when adding new features or endpoints
