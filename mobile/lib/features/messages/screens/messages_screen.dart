import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:cook_ideas/core/theme/app_theme.dart';
import 'package:cook_ideas/core/providers/auth_provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  List<Map<String, dynamic>> conversations = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadConversations();
  }

  Future<void> _loadConversations() async {
    final user = context.read<AuthProvider>().user;
    if (user == null) return;

    setState(() {
      loading = true;
      error = null;
    });

    try {
      final supabase = Supabase.instance.client;
      
      // Get conversations where user is a participant
      final result = await supabase
          .from('conversation_participants')
          .select('''
            conversation_id,
            last_read_at,
            conversations!inner(
              id,
              title,
              created_at,
              updated_at
            )
          ''')
          .eq('user_id', user.id)
          .order('conversations(updated_at)', ascending: false);

      final List<Map<String, dynamic>> processedConversations = [];

      for (final item in result) {
        final conversation = item['conversations'];
        if (conversation == null) continue;

        // Get other participants for conversation title
        final participantsResult = await supabase
            .from('conversation_participants')
            .select('profiles!inner(username, avatar_url)')
            .eq('conversation_id', conversation['id'])
            .neq('user_id', user.id);

        // Get latest message
        final latestMessageResult = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conversation['id'])
            .order('created_at', ascending: false)
            .limit(1);

        final otherParticipants = participantsResult
            .map((p) => p['profiles'])
            .where((p) => p != null)
            .toList();

        final latestMessage = latestMessageResult.isNotEmpty 
            ? latestMessageResult.first 
            : null;

        // Check if conversation has unread messages
        final lastReadAt = DateTime.parse(item['last_read_at']);
        final hasUnread = latestMessage != null &&
            DateTime.parse(latestMessage['created_at']).isAfter(lastReadAt) &&
            latestMessage['sender_id'] != user.id;

        processedConversations.add({
          'id': conversation['id'],
          'title': conversation['title'] ?? 
              (otherParticipants.isNotEmpty 
                  ? otherParticipants.map((p) => p['username']).join(', ')
                  : 'Chat'),
          'last_message': latestMessage?['content'] ?? 'No messages yet',
          'updated_at': conversation['updated_at'],
          'has_unread': hasUnread,
          'other_participants': otherParticipants,
        });
      }

      setState(() {
        conversations = processedConversations;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  String _formatDate(String dateString) {
    final date = DateTime.parse(dateString);
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 0) {
      return '${difference.inDays}d';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m';
    } else {
      return 'now';
    }
  }

  String _truncateMessage(String message, int maxLength) {
    if (message.length <= maxLength) return message;
    return '${message.substring(0, maxLength)}...';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
        actions: [
          IconButton(
            onPressed: () => context.push('/messages/new'),
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppTheme.backgroundGradient,
        ),
        child: RefreshIndicator(
          onRefresh: _loadConversations,
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
                            'Failed to load messages',
                            style: TextStyle(
                              fontSize: 18,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: _loadConversations,
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    )
                  : conversations.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.message_outlined,
                                size: 64,
                                color: Colors.grey,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'No conversations yet',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey[600],
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Start chatting with your team',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[500],
                                ),
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton.icon(
                                onPressed: () => context.push('/messages/new'),
                                icon: const Icon(Icons.add),
                                label: const Text('Start Conversation'),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: conversations.length,
                          itemBuilder: (context, index) {
                            final conversation = conversations[index];
                            final otherParticipants = conversation['other_participants'] as List;
                            
                            return Card(
                              margin: const EdgeInsets.only(bottom: 8),
                              child: ListTile(
                                leading: Stack(
                                  children: [
                                    CircleAvatar(
                                      radius: 24,
                                      backgroundImage: otherParticipants.isNotEmpty &&
                                              otherParticipants.first['avatar_url'] != null
                                          ? NetworkImage(otherParticipants.first['avatar_url'])
                                          : null,
                                      child: otherParticipants.isEmpty ||
                                              otherParticipants.first['avatar_url'] == null
                                          ? Text(
                                              conversation['title'][0].toUpperCase(),
                                              style: const TextStyle(fontSize: 16),
                                            )
                                          : null,
                                    ),
                                    if (conversation['has_unread'])
                                      Positioned(
                                        right: 0,
                                        top: 0,
                                        child: Container(
                                          width: 12,
                                          height: 12,
                                          decoration: const BoxDecoration(
                                            color: AppTheme.successColor,
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                                title: Text(
                                  conversation['title'],
                                  style: TextStyle(
                                    fontWeight: conversation['has_unread']
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                  ),
                                ),
                                subtitle: Text(
                                  _truncateMessage(conversation['last_message'], 50),
                                  style: TextStyle(
                                    color: conversation['has_unread']
                                        ? Colors.black87
                                        : Colors.grey[600],
                                    fontWeight: conversation['has_unread']
                                        ? FontWeight.w500
                                        : FontWeight.normal,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                trailing: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      _formatDate(conversation['updated_at']),
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                    if (conversation['has_unread'])
                                      Container(
                                        margin: const EdgeInsets.only(top: 4),
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 6,
                                          vertical: 2,
                                        ),
                                        decoration: const BoxDecoration(
                                          color: AppTheme.primaryColor,
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Text(
                                          '•',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                                onTap: () {
                                  context.push('/messages/${conversation['id']}');
                                },
                              ),
                            );
                          },
                        ),
        ),
      ),
    );
  }
}