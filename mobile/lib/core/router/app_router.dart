import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cook_ideas/features/auth/screens/login_screen.dart';
import 'package:cook_ideas/features/auth/screens/register_screen.dart';
import 'package:cook_ideas/features/auth/screens/forgot_password_screen.dart';
import 'package:cook_ideas/features/home/screens/main_screen.dart';
import 'package:cook_ideas/features/ideas/screens/create_idea_screen.dart';
import 'package:cook_ideas/features/ideas/screens/idea_detail_screen.dart';
import 'package:cook_ideas/features/ideas/screens/edit_idea_screen.dart';
import 'package:cook_ideas/features/profile/screens/profile_screen.dart';
import 'package:cook_ideas/features/profile/screens/edit_profile_screen.dart';
import 'package:cook_ideas/features/profile/screens/settings_screen.dart';
import 'package:cook_ideas/features/forum/screens/forum_screen.dart';
import 'package:cook_ideas/features/forum/screens/create_thread_screen.dart';
import 'package:cook_ideas/features/forum/screens/thread_detail_screen.dart';
import 'package:cook_ideas/features/messages/screens/messages_screen.dart';
import 'package:cook_ideas/features/messages/screens/chat_screen.dart';
import 'package:cook_ideas/features/messages/screens/new_conversation_screen.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isAuthenticated = Supabase.instance.client.auth.currentUser != null;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');
      
      if (!isAuthenticated && !isAuthRoute) {
        return '/auth/login';
      }
      
      if (isAuthenticated && isAuthRoute) {
        return '/';
      }
      
      return null;
    },
    routes: [
      // Auth Routes
      GoRoute(
        path: '/auth/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/auth/forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      
      // Main App Routes
      ShellRoute(
        builder: (context, state, child) => MainScreen(child: child),
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const SizedBox.shrink(),
          ),
          GoRoute(
            path: '/ideas',
            builder: (context, state) => const SizedBox.shrink(),
          ),
          GoRoute(
            path: '/forum',
            builder: (context, state) => const ForumScreen(),
          ),
          GoRoute(
            path: '/messages',
            builder: (context, state) => const MessagesScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
      
      // Detail Routes
      GoRoute(
        path: '/ideas/create',
        builder: (context, state) => const CreateIdeaScreen(),
      ),
      GoRoute(
        path: '/ideas/:id',
        builder: (context, state) => IdeaDetailScreen(
          ideaId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/ideas/:id/edit',
        builder: (context, state) => EditIdeaScreen(
          ideaId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/profile/edit',
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: '/profile/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/forum/create',
        builder: (context, state) => const CreateThreadScreen(),
      ),
      GoRoute(
        path: '/forum/thread/:id',
        builder: (context, state) => ThreadDetailScreen(
          threadId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/messages/new',
        builder: (context, state) => const NewConversationScreen(),
      ),
      GoRoute(
        path: '/messages/:id',
        builder: (context, state) => ChatScreen(
          conversationId: state.pathParameters['id']!,
        ),
      ),
    ],
  );
}