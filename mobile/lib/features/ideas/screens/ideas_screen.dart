import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:cook_ideas/core/theme/app_theme.dart';
import 'package:cook_ideas/core/providers/auth_provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class IdeasScreen extends StatefulWidget {
  const IdeasScreen({super.key});

  @override
  State<IdeasScreen> createState() => _IdeasScreenState();
}

class _IdeasScreenState extends State<IdeasScreen> {
  List<Map<String, dynamic>> ideas = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadIdeas();
  }

  Future<void> _loadIdeas() async {
    final user = context.read<AuthProvider>().user;
    if (user == null) return;

    setState(() {
      loading = true;
      error = null;
    });

    try {
      final supabase = Supabase.instance.client;
      
      // Get user's own ideas
      final ownIdeasResult = await supabase
          .from('ideas')
          .select('*, profiles!ideas_creator_id_fkey(username)')
          .eq('creator_id', user.id)
          .order('created_at', ascending: false);

      // Get ideas where user is a member
      final memberIdeasResult = await supabase
          .from('idea_members')
          .select('''
            role,
            equity_percentage,
            ideas!idea_members_idea_id_fkey(
              *,
              profiles!ideas_creator_id_fkey(username)
            )
          ''')
          .eq('user_id', user.id);

      final List<Map<String, dynamic>> allIdeas = [];
      
      // Add own ideas
      for (final idea in ownIdeasResult.data) {
        allIdeas.add({
          ...idea,
          'user_role': 'owner',
          'equity_percentage': null,
        });
      }
      
      // Add member ideas (avoid duplicates)
      for (final member in memberIdeasResult.data) {
        final idea = member['ideas'];
        if (idea != null && !allIdeas.any((i) => i['id'] == idea['id'])) {
          allIdeas.add({
            ...idea,
            'user_role': member['role'],
            'equity_percentage': member['equity_percentage'],
          });
        }
      }

      setState(() {
        ideas = allIdeas;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  String _formatRole(String role) {
    return role.split('_').map((word) => 
      word[0].toUpperCase() + word.substring(1)
    ).join(' ');
  }

  String _formatDate(String dateString) {
    final date = DateTime.parse(dateString);
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays == 1 ? '' : 's'} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours == 1 ? '' : 's'} ago';
    } else {
      return 'Today';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Ideas'),
        actions: [
          IconButton(
            onPressed: () => context.push('/ideas/create'),
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppTheme.backgroundGradient,
        ),
        child: RefreshIndicator(
          onRefresh: _loadIdeas,
          child: loading
              ? const Center(child: CircularProgressIndicator())
              : error != null
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.error_outline,
                            size: 64,
                            color: Colors.red,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Failed to load ideas',
                            style: TextStyle(
                              fontSize: 18,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: _loadIdeas,
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    )
                  : ideas.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.lightbulb_outline,
                                size: 64,
                                color: Colors.grey,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'No ideas yet',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey[600],
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Create your first idea to get started',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[500],
                                ),
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton.icon(
                                onPressed: () => context.push('/ideas/create'),
                                icon: const Icon(Icons.add),
                                label: const Text('Create Idea'),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: ideas.length,
                          itemBuilder: (context, index) {
                            final idea = ideas[index];
                            return Card(
                              margin: const EdgeInsets.only(bottom: 16),
                              child: InkWell(
                                onTap: () => context.push('/ideas/${idea['id']}'),
                                borderRadius: BorderRadius.circular(12),
                                child: Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            width: 50,
                                            height: 50,
                                            decoration: BoxDecoration(
                                              gradient: AppTheme.primaryGradient,
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: const Icon(
                                              Icons.lightbulb,
                                              color: Colors.white,
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  idea['name'] ?? 'Untitled Idea',
                                                  style: const TextStyle(
                                                    fontSize: 18,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                if (idea['problem_category'] != null)
                                                  Container(
                                                    margin: const EdgeInsets.only(top: 4),
                                                    padding: const EdgeInsets.symmetric(
                                                      horizontal: 8,
                                                      vertical: 2,
                                                    ),
                                                    decoration: BoxDecoration(
                                                      color: AppTheme.primaryColor.withOpacity(0.1),
                                                      borderRadius: BorderRadius.circular(12),
                                                    ),
                                                    child: Text(
                                                      idea['problem_category'],
                                                      style: const TextStyle(
                                                        fontSize: 12,
                                                        color: AppTheme.primaryColor,
                                                        fontWeight: FontWeight.w500,
                                                      ),
                                                    ),
                                                  ),
                                              ],
                                            ),
                                          ),
                                          Icon(
                                            idea['visibility'] == true
                                                ? Icons.public
                                                : Icons.lock,
                                            color: Colors.grey[400],
                                            size: 20,
                                          ),
                                        ],
                                      ),
                                      if (idea['description'] != null) ...[
                                        const SizedBox(height: 12),
                                        Text(
                                          idea['description'],
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: Colors.grey[600],
                                          ),
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ],
                                      const SizedBox(height: 12),
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: AppTheme.accentColor.withOpacity(0.1),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              _formatRole(idea['user_role']),
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: AppTheme.accentColor,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ),
                                          if (idea['equity_percentage'] != null) ...[
                                            const SizedBox(width: 8),
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 4,
                                              ),
                                              decoration: BoxDecoration(
                                                color: AppTheme.successColor.withOpacity(0.1),
                                                borderRadius: BorderRadius.circular(12),
                                              ),
                                              child: Text(
                                                '${idea['equity_percentage']}% Equity',
                                                style: const TextStyle(
                                                  fontSize: 12,
                                                  color: AppTheme.successColor,
                                                  fontWeight: FontWeight.w500,
                                                ),
                                              ),
                                            ),
                                          ],
                                          const Spacer(),
                                          Text(
                                            _formatDate(idea['created_at']),
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey[500],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
        ),
      ),
    );
  }
}