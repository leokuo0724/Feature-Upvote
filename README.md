# Feature Upvote Web App

A modern feature request and upvoting platform built with Next.js, Firebase, and Tailwind CSS.

## Features

- 🚀 **Feature Request Management**: Create, view, and manage feature requests
- 👍 **Upvoting System**: Users can upvote features they want to see
- 💬 **Comments & Hearts**: Engage with feature requests through comments and reactions
- 🏷️ **Status Management**: Track feature progress with customizable statuses
- 🔐 **Google OAuth**: Secure authentication with Firebase Auth
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Real-time Updates**: Live updates using Firebase Firestore

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase (Auth + Firestore)
- **Architecture**: Feature Sliced Design (FSD)
- **Package Manager**: pnpm

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd feature-upvote
pnpm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Enable Google OAuth provider in Authentication settings
4. Copy your Firebase config

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Product Owner Configuration (comma-separated emails)
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,owner@example.com
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── shared/                 # Shared utilities and components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── lib/               # Utility functions
│   ├── hooks/             # Shared React hooks
│   ├── types/             # TypeScript type definitions
│   └── config/            # Configuration files
├── entities/              # Business entities
├── features/              # Feature-specific logic
├── widgets/               # Composite components
└── lib/                   # Third-party library configurations
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all the environment variables in your deployment platform:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_ADMIN_EMAILS`

## Admin Configuration

To make users administrators (able to manage feature requests and labels):

1. Add their email addresses to the `NEXT_PUBLIC_ADMIN_EMAILS` environment variable
2. Separate multiple emails with commas
3. Restart your application

Admin users can:

- Update feature request statuses
- Add/remove labels
- Delete feature requests
- Delete comments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
