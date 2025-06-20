import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:cook_ideas/core/providers/auth_provider.dart';
import 'package:cook_ideas/core/theme/app_theme.dart';
import 'package:cook_ideas/shared/widgets/gradient_button.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class NewConversationScreen extends StatefulWidget {
  const NewConversationScreen({super.key});

  @override
  State<NewConversationScreen> createState() => _NewConversationScreenState();
}

class _NewConversationScreenState extends State<NewConversationScreen> {
  final _searchController = TextEditingController();
  List<Map<String, dynamic>> _users = [];
  List<Map<String, dynamic>> _selectedUsers = [];
  bool _loading = false;
  bool _searching = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _searchUsers(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _users = [];
        _searching = false;
      });
      return;
    }

    setState(() {
      _searching = true;
    });

    try {
      final currentUser = context.read<AuthProvider>().user;
      final supabase = Supabase.instance.client;
      
      final result = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .neq('id', currentUser?.id ?? '')
          .or('username.ilike.%$query%,full_name.ilike.%$query%')
          .limit(20);

      setState(() {
        _users = result;
        _searching = false;
      });
    } catch (e) {
      setState(() {
        _searching = false;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error searching users: $e')),
        );
      }
    }
  }

  void _toggleUserSelection(Map<String, dynamic> user) {
    setState(() {
      final isSelected = _selectedUsers.any((u) => u['id'] == user['id']);
      if (isSelected) {
        _selectedUsers.removeWhere((u) => u['id'] == user['id']);
      } else {
        _selectedUsers.add(user);
      }
    });
  }

  Future<void> _createConversation() async {
    if (_selectedUsers.isEmpty) return;

    setState(() {
      _loading = true;
    });

    try {
      final currentUser = context.read<AuthProvider>().user;
      final supabase = Supabase.instance.client;

      // Create conversation
      final conversationResult = await supabase
          .from('conversations')
          .insert({
            'title': _selectedUsers.length == 1 
                ? null 
                : 'Group Chat',
          })
          .select()
          .single();

      final conversationId = conversationResult['id'];

      // Add participants (current user + selected users)
      final participants = [
        {'conversation_id': conversationId, 'user_id': currentUser!.id},
        ..._selectedUsers.map((user) => {
          'conversation_id': conversationId,
          'user_id': user['id'],
        }),
      ];

      await supabase
          .from('conversation_participants')
          .insert(participants);

      if (mounted) {
        context.pop();
        context.push('/messages/$conversationId');
      }
    } catch (e) {
      setState(() {
        _loading = false;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error creating conversation: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Message'),
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.close),
        ),
        actions: [
          if (_selectedUsers.isNotEmpty)
            TextButton(
              onPressed: _loading ? null : _createConversation,
              child: _loading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Create'),
            ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppTheme.backgroundGradient,
        ),
        child: Column(
          children: [
            // Search Bar
            Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search users...',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                  fillColor: Colors.white,
                ),
                onChanged: _searchUsers,
              ),
            ),

            // Selected Users
            if (_selectedUsers.isNotEmpty) ...[
              Container(
                height: 80,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _selectedUsers.length,
                  itemBuilder: (context, index) {
                    final user = _selectedUsers[index];
                    return Padding(
                      padding: const EdgeInsets.only(right: 12),
                      child: Column(
                        children: [
                          Stack(
                            children: [
                              CircleAvatar(
                                radius: 25,
                                backgroundImage: user['avatar_url'] != null
                                    ? NetworkImage(user['avatar_url'])
                                    : null,
                                child: user['avatar_url'] == null
                                    ? Text(
                                        (user['username'] ?? 'U')[0].toUpperCase(),
                                        style: const TextStyle(fontSize: 16),
                                      )
                                    : null,
                              ),
                              Positioned(
                                top: -5,
                                right: -5,
                                child: GestureDetector(
                                  onTap: () => _toggleUserSelection(user),
                                  child: Container(
                                    width: 20,
                                    height: 20,
                                    decoration: const BoxDecoration(
                                      color: Colors.red,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      Icons.close,
                                      size: 14,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            user['username'] ?? 'Unknown',
                            style: const TextStyle(fontSize: 12),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              const Divider(),
            ],

            // Search Results
            Expanded(
              child: _searching
                  ? const Center(child: CircularProgressIndicator())
                  : _users.isEmpty && _searchController.text.isNotEmpty
                      ? const Center(
                          child: Text(
                            'No users found',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),
                        )
                      : _searchController.text.isEmpty
                          ? const Center(
                              child: Text(
                                'Search for users to start a conversation',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey,
                                ),
                              ),
                            )
                          : ListView.builder(
                              itemCount: _users.length,
                              itemBuilder: (context, index) {
                                final user = _users[index];
                                final isSelected = _selectedUsers
                                    .any((u) => u['id'] == user['id']);

                                return Card(
                                  margin: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 4,
                                  ),
                                  child: ListTile(
                                    leading: CircleAvatar(
                                      backgroundImage: user['avatar_url'] != null
                                          ? NetworkImage(user['avatar_url'])
                                          : null,
                                      child: user['avatar_url'] == null
                                          ? Text(
                                              (user['username'] ?? 'U')[0]
                                                  .toUpperCase(),
                                            )
                                          : null,
                                    ),
                                    title: Text(
                                      user['full_name'] ?? user['username'] ?? 'Unknown User',
                                    ),
                                    subtitle: user['full_name'] != null
                                        ? Text('@${user['username']}')
                                        : null,
                                    trailing: isSelected
                                        ? const Icon(
                                            Icons.check_circle,
                                            color: AppTheme.primaryColor,
                                          )
                                        : const Icon(Icons.add_circle_outline),
                                    onTap: () => _toggleUserSelection(user),
                                  ),
                                );
                              },
                            ),
            ),
          ],
        ),
      ),
    );
  }
}