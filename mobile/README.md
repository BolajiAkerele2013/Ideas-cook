# Cook.ideas Mobile App

A Flutter mobile application for the Cook.ideas platform - Create, manage, and collaborate on ideas.

## Features

### 🔐 Authentication
- Email/password registration and login
- Profile creation with avatar upload
- Secure session management with Supabase

### 💡 Idea Management
- Create and edit ideas with rich details
- Categorize ideas by problem type
- Set visibility (public/private)
- View and manage your idea portfolio

### 👥 Team Collaboration
- View team members and their roles
- Task management with Kanban-style boards
- File sharing and document management
- Real-time activity tracking

### 💬 Community Features
- Forum discussions with categories
- Create and participate in threads
- Comment and engage with community
- Direct messaging between users

### 📱 Mobile-Optimized Design
- Beautiful, responsive UI for iOS and Android
- Smooth animations and transitions
- Intuitive navigation with bottom tabs
- Pull-to-refresh and infinite scrolling

## Getting Started

### Prerequisites
- Flutter SDK (>=3.10.0)
- Dart SDK (>=3.0.0)
- Android Studio / Xcode for device testing
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure Supabase**
   - Update `lib/core/config/app_config.dart` with your Supabase URL and anon key
   - Ensure your Supabase project has the required database schema

4. **Run the app**
   ```bash
   # For development
   flutter run

   # For specific platform
   flutter run -d android
   flutter run -d ios
   ```

### Building for Production

#### Android
```bash
flutter build apk --release
# or for app bundle
flutter build appbundle --release
```

#### iOS
```bash
flutter build ios --release
```

## Project Structure

```
lib/
├── core/                   # Core functionality
│   ├── config/            # App configuration
│   ├── providers/         # State management
│   ├── router/            # Navigation setup
│   ├── services/          # API services
│   └── theme/             # App theming
├── features/              # Feature modules
│   ├── auth/              # Authentication
│   ├── home/              # Dashboard
│   ├── ideas/             # Idea management
│   ├── forum/             # Community forum
│   ├── messages/          # Direct messaging
│   └── profile/           # User profile
└── shared/                # Shared components
    └── widgets/           # Reusable UI components
```

## Key Technologies

- **Flutter**: Cross-platform mobile framework
- **Supabase**: Backend-as-a-Service for auth, database, and storage
- **Provider**: State management solution
- **GoRouter**: Declarative routing
- **Material Design 3**: Modern UI components

## Features Implementation Status

### ✅ Completed
- Authentication (login/register)
- Profile management with avatar upload
- Basic idea creation and editing
- Forum thread creation and viewing
- Direct messaging interface
- Navigation and routing
- Responsive design

### 🚧 In Progress
- Real-time messaging
- Task management integration
- File upload and sharing
- Push notifications
- Offline support

### 📋 Planned
- Video/voice calling
- Advanced search and filtering
- Analytics and insights
- Team collaboration tools
- Integration with web platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ using Flutter and Supabase