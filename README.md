# SamvaadCop - संवाद कॉप

**A Government-Grade Police Kiosk Communication Platform**

SamvaadCop is a sophisticated multilingual communication platform designed for police stations and government kiosks. It enables real-time conversation between citizens and officers across multiple Indian languages using BHASHINI AI services.

## 🇮🇳 Key Features

- **Multilingual Support**: Hindi, English, Tamil, Telugu, Urdu, Marathi, Bengali
- **Real-time Translation**: Powered by BHASHINI ASR, NMT, and TTS
- **Government-Grade UI**: Indian tricolor theme with National Emblem
- **Legal Assistant**: BNS (Bharatiya Nyaya Sanhita) 2023 search
- **FIR Checklist**: Automated First Information Report generation
- **Offline Resilience**: Queue messages when offline, auto-process when online
- **Accessibility**: WCAG AA compliant with keyboard shortcuts
- **Audio Recording**: Live waveform visualization and voice input

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- BHASHINI API credentials ([Register here](https://bhashini.gov.in/en/ulca))

### Local Development

1. **Clone and Install**
```bash
git clone <YOUR_GIT_URL>
cd samvaadcop
npm install
```

2. **Environment Setup**
```bash
cp .env.local.example .env.local
# Edit .env.local with your BHASHINI credentials
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Application**
Navigate to `http://localhost:8080`

### Environment Variables

Create `.env.local` file with:
```env
NEXT_PUBLIC_BHASHINI_BASE_URL=https://dhruva-api.bhashini.gov.in/services
NEXT_PUBLIC_BHASHINI_API_KEY=your_api_key_here
NEXT_PUBLIC_BHASHINI_USER_ID=your_user_id_here
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🎯 Usage

### Three-Panel Interface
- **Left Panel (Citizen)**: Voice recording with waveform, multilingual text input
- **Center Panel (Conversation)**: Real-time translated conversation with confidence scores
- **Right Panel (Officer)**: Response tools, Legal Assistant, FIR Checklist

### Keyboard Shortcuts
- `Alt + V` - Start/Stop voice recording
- `Alt + T` - Play last audio message
- `Alt + L` - Open Legal Assistant
- `Alt + D` - Open Admin Dashboard

### Accessibility Features
- High contrast mode toggle
- Large text mode toggle
- Screen reader support
- Touch targets ≥44px (mobile-friendly)

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: shadcn/ui, Tailwind CSS
- **AI Integration**: BHASHINI (ASR, NMT, TTS)
- **Fonts**: PT Sans (headings), Inter (body)
- **Icons**: Lucide React
- **Audio**: Web Audio API

## 🚀 Deployment

### Lovable Platform
1. Open [Lovable Project](https://lovable.dev/projects/6f8c71ce-cc27-4107-9b4f-e2663ec49b68)
2. Click Share → Publish
3. Add your BHASHINI credentials in environment settings

### Other Platforms
```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel

# Deploy to Firebase
npm install -g firebase-tools
firebase deploy
```

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
