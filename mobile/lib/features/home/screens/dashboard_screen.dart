import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:cook_ideas/core/providers/auth_provider.dart';
import 'package:cook_ideas/core/theme/app_theme.dart';
import 'package:cook_ideas/shared/widgets/gradient_card.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, int> stats = {
    'ideas': 0,
    'tasks': 0,
    'messages': 0,
    'forumPosts': 0,
  };
  List<Map<String, dynamic>> recentActivity = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    final user = context.read<AuthProvider>().user;
    if (user == null) return;

    try {
      final supabase = Supabase.instance.client;

      // Load user stats
      final futures = await Future.wait([
        // Count user's ideas
        supabase
            .from('ideas')
            .select('id')
            .eq('creator_id', user.id)
            .count(CountOption.exact),
        
        // Count user's tasks
        supabase
            .from('tasks')
            .select('id')
            .eq('created_by', user.id)
            .count(CountOption.exact),
        
        // Count user's forum posts
        supabase
            .from('forum_threads')
            .select('id')
            .eq('creator_id', user.id)
            .count(CountOption.exact),
        
        // Get recent activity (ideas and forum posts)
        supabase
            .from('ideas')
            .select('id, name, created_at')
            .eq('creator_id', user.id)
            .order('created_at', ascending: false)
            .limit(3),
      ]);

      final ideasCount = futures[0].count;
      final tasksCount = futures[1].count;
      final forumPostsCount = futures[2].count;
      final recentIdeas = futures[3].data as List<dynamic>;

      // Get conversation count
      final conversationsResult = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id)
          .count(CountOption.exact);

      setState(() {
        stats = {
          'ideas': ideasCount,
          'tasks': tasksCount,
          'messages': conversationsResult.count,
          'forumPosts': forumPostsCount,
        };
        
        recentActivity = recentIdeas.map((idea) => {
          'type': 'idea',
          'title': 'Created idea "${idea['name']}"',
          'time': _formatTimeAgo(idea['created_at']),
          'icon': Icons.lightbulb,
        }).toList();
        
        loading = false;
      });
    } catch (e) {
      setState(() {
        loading = false;
      });
    }
  }

  String _formatTimeAgo(String dateString) {
    final date = DateTime.parse(dateString);
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays == 1 ? '' : 's'} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours == 1 ? '' : 's'} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute${difference.inMinutes == 1 ? '' : 's'} ago';
    } else {
      return 'Just now';
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
            onRefresh: _loadDashboardData,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Consumer<AuthProvider>(
                    builder: (context, authProvider, child) {
                      final profile = authProvider.profile;
                      return Row(
                        children: [
                          CircleAvatar(
                            radius: 25,
                            backgroundImage: profile?.avatarUrl != null
                                ? NetworkImage(profile!.avatarUrl!)
                                : null,
                            child: profile?.avatarUrl == null
                                ? const Icon(Icons.person)
                                : null,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Welcome back,',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                Text(
                                  profile?.displayName ?? 'User',
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            onPressed: () {
                              // TODO: Implement notifications
                            },
                            icon: const Icon(Icons.notifications_outlined),
                          ),
                        ],
                      );
                    },
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Quick Actions
                  const Text(
                    'Quick Actions',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  Row(
                    children: [
                      Expanded(
                        child: GradientCard(
                          onTap: () => context.push('/ideas/create'),
                          child: const Column(
                            children: [
                              Icon(
                                Icons.add_circle_outline,
                                size: 32,
                                color: Colors.white,
                              ),
                              SizedBox(height: 8),
                              Text(
                                'New Idea',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: GradientCard(
                          onTap: () => context.push('/forum/create'),
                          child: const Column(
                            children: [
                              Icon(
                                Icons.forum_outlined,
                                size: 32,
                                color: Colors.white,
                              ),
                              SizedBox(height: 8),
                              Text(
                                'Start Discussion',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Stats Cards
                  const Text(
                    'Your Progress',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  if (loading)
                    const Center(
                      child: CircularProgressIndicator(),
                    )
                  else ...[
                    Row(
                      children: [
                        Expanded(
                          child: _StatCard(
                            title: 'Ideas',
                            value: stats['ideas'].toString(),
                            icon: Icons.lightbulb_outline,
                            color: AppTheme.primaryColor,
                            onTap: () => context.go('/ideas'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _StatCard(
                            title: 'Tasks',
                            value: stats['tasks'].toString(),
                            icon: Icons.task_outlined,
                            color: AppTheme.successColor,
                            onTap: () {
                              // Navigate to tasks when implemented
                            },
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 16),
                    
                    Row(
                      children: [
                        Expanded(
                          child: _StatCard(
                            title: 'Messages',
                            value: stats['messages'].toString(),
                            icon: Icons.message_outlined,
                            color: AppTheme.accentColor,
                            onTap: () => context.go('/messages'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _StatCard(
                            title: 'Forum Posts',
                            value: stats['forumPosts'].toString(),
                            icon: Icons.forum_outlined,
                            color: AppTheme.warningColor,
                            onTap: () => context.go('/forum'),
                          ),
                        ),
                      ],
                    ),
                  ],
                  
                  const SizedBox(height: 32),
                  
                  // Recent Activity
                  const Text(
                    'Recent Activity',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: recentActivity.isEmpty
                            ? [
                                const Center(
                                  child: Padding(
                                    padding: EdgeInsets.all(20),
                                    child: Text(
                                      'No recent activity',
                                      style: TextStyle(
                                        color: Colors.grey,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ),
                                ),
                              ]
                            : recentActivity.map((activity) {
                                return Column(
                                  children: [
                                    _ActivityItem(
                                      icon: activity['icon'],
                                      title: activity['title'],
                                      time: activity['time'],
                                    ),
                                    if (activity != recentActivity.last)
                                      const Divider(),
                                  ],
                                );
                              }).toList(),
                      ),
                    ),
                  ),
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
  final Color color;
  final VoidCallback? onTap;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(
                icon,
                size: 32,
                color: color,
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

class _ActivityItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String time;

  const _ActivityItem({
    required this.icon,
    required this.title,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(
            icon,
            size: 20,
            color: AppTheme.primaryColor,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  time,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}