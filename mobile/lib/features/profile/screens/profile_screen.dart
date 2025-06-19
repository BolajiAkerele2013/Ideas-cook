import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:cook_ideas/core/providers/auth_provider.dart';
import 'package:cook_ideas/core/theme/app_theme.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, int> stats = {
    'ideas': 0,
    'posts': 0,
    'tasks': 0,
    'conversations': 0,
  };
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final user = context.read<AuthProvider>().user;
    if (user == null) return;

    try {
      final supabase = Supabase.instance.client;

      final futures = await Future.wait([
        // Count user's ideas
        supabase
            .from('ideas')
            .select('id')
            .eq('creator_id', user.id)
            .count(CountOption.exact),
        
        // Count user's forum posts
        supabase
            .from('forum_threads')
            .select('id')
            .eq('creator_id', user.id)
            .count(CountOption.exact),
        
        // Count user's tasks
        supabase
            .from('tasks')
            .select('id')
            .eq('created_by', user.id)
            .count(CountOption.exact),
        
        // Count user's conversations
        supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', user.id)
            .count(CountOption.exact),
      ]);

      setState(() {
        stats = {
          'ideas': futures[0].count,
          'posts': futures[1].count,
          'tasks': futures[2].count,
          'conversations': futures[3].count,
        };
        loading = false;
      });
    } catch (e) {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppTheme.backgroundGradient,
        ),
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: _loadStats,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                children: [
                  // Profile Header
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: const BoxDecoration(
                      gradient: AppTheme.primaryGradient,
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(32),
                        bottomRight: Radius.circular(32),
                      ),
                    ),
                    child: Consumer<AuthProvider>(
                      builder: (context, authProvider, child) {
                        final profile = authProvider.profile;
                        return Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Profile',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                IconButton(
                                  onPressed: () => context.push('/profile/edit'),
                                  icon: const Icon(
                                    Icons.edit,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 24),
                            CircleAvatar(
                              radius: 50,
                              backgroundImage: profile?.avatarUrl != null
                                  ? NetworkImage(profile!.avatarUrl!)
                                  : null,
                              child: profile?.avatarUrl == null
                                  ? const Icon(
                                      Icons.person,
                                      size: 50,
                                      color: Colors.white,
                                    )
                                  : null,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              profile?.displayName ?? 'User',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              profile?.username ?? '',
                              style: const TextStyle(
                                fontSize: 16,
                                color: Colors.white70,
                              ),
                            ),
                            if (profile?.bio != null) ...[
                              const SizedBox(height: 8),
                              Text(
                                profile!.bio!,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Colors.white70,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ],
                        );
                      },
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Stats Cards
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: loading
                        ? const Center(child: CircularProgressIndicator())
                        : Column(
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: _StatCard(
                                      title: 'Ideas',
                                      value: stats['ideas'].toString(),
                                      icon: Icons.lightbulb_outline,
                                      onTap: () => context.go('/ideas'),
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: _StatCard(
                                      title: 'Posts',
                                      value: stats['posts'].toString(),
                                      icon: Icons.forum_outlined,
                                      onTap: () => context.go('/forum'),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              Row(
                                children: [
                                  Expanded(
                                    child: _StatCard(
                                      title: 'Tasks',
                                      value: stats['tasks'].toString(),
                                      icon: Icons.task_outlined,
                                      onTap: () {
                                        // TODO: Navigate to tasks when implemented
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(
                                            content: Text('Tasks view coming soon!'),
                                          ),
                                        );
                                      },
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: _StatCard(
                                      title: 'Chats',
                                      value: stats['conversations'].toString(),
                                      icon: Icons.message_outlined,
                                      onTap: () => context.go('/messages'),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Menu Items
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      children: [
                        _MenuItem(
                          icon: Icons.lightbulb_outline,
                          title: 'My Ideas',
                          onTap: () => context.go('/ideas'),
                        ),
                        _MenuItem(
                          icon: Icons.task_outlined,
                          title: 'My Tasks',
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Tasks view coming soon!'),
                              ),
                            );
                          },
                        ),
                        _MenuItem(
                          icon: Icons.forum_outlined,
                          title: 'My Posts',
                          onTap: () => context.go('/forum'),
                        ),
                        _MenuItem(
                          icon: Icons.message_outlined,
                          title: 'Messages',
                          onTap: () => context.go('/messages'),
                        ),
                        _MenuItem(
                          icon: Icons.settings_outlined,
                          title: 'Settings',
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Settings coming soon!'),
                              ),
                            );
                          },
                        ),
                        _MenuItem(
                          icon: Icons.help_outline,
                          title: 'Help & Support',
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Help & Support coming soon!'),
                              ),
                            );
                          },
                        ),
                        _MenuItem(
                          icon: Icons.logout,
                          title: 'Sign Out',
                          onTap: () async {
                            final confirmed = await showDialog<bool>(
                              context: context,
                              builder: (context) => AlertDialog(
                                title: const Text('Sign Out'),
                                content: const Text('Are you sure you want to sign out?'),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.of(context).pop(false),
                                    child: const Text('Cancel'),
                                  ),
                                  TextButton(
                                    onPressed: () => Navigator.of(context).pop(true),
                                    child: const Text('Sign Out'),
                                  ),
                                ],
                              ),
                            );
                            
                            if (confirmed == true && mounted) {
                              final authProvider = context.read<AuthProvider>();
                              await authProvider.signOut();
                              if (context.mounted) {
                                context.go('/auth/login');
                              }
                            }
                          },
                          isDestructive: true,
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final VoidCallback? onTap;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Icon(
                icon,
                size: 32,
                color: AppTheme.primaryColor,
              ),
              
              const SizedBox(height: 8),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final bool isDestructive;

  const _MenuItem({
    required this.icon,
    required this.title,
    required this.onTap,
    this.isDestructive = false,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(
          icon,
          color: isDestructive ? AppTheme.errorColor : AppTheme.primaryColor,
        ),
        title: Text(
          title,
          style: TextStyle(
            color: isDestructive ? AppTheme.errorColor : null,
            fontWeight: FontWeight.w500,
          ),
        ),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}