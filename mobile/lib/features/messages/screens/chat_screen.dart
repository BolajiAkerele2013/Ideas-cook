import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cook_ideas/core/theme/app_theme.dart';
import 'package:cook_ideas/core/providers/auth_provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class ChatScreen extends StatefulWidget {
  final String conversationId;
  
  const ChatScreen({super.key, required this.conversationId});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _messageController = TextEditingController();
  final _scrollController = ScrollController();
  List<Map<String, dynamic>> messages = [];
  Map<String, dynamic>? conversation;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadConversation();
    _loadMessages();
    _subscribeToMessages();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadConversation() async {
    try {
      final supabase = Supabase.instance.client;
      final user = context.read<AuthProvider>().user;
      
      if (user == null) return;

      // Get conversation details
      final conversationResult = await supabase
          .from('conversations')
          .select('*')
          .eq('id', widget.conversationId)
          .single();

      // Get other participants
      final participantsResult = await supabase
          .from('conversation_participants')
          .select('profiles!inner(username, avatar_url)')
          .eq('conversation_id', widget.conversationId)
          .neq('user_id', user.id);

      final otherParticipants = participantsResult.data
          .map((p) => p['profiles'])
          .where((p) => p != null)
          .toList();

      setState(() {
        conversation = {
          ...conversationResult.data,
          'other_participants': otherParticipants,
          'title': conversationResult.data['title'] ?? 
              (otherParticipants.isNotEmpty 
                  ? otherParticipants.map((p) => p['username']).join(', ')
                  : 'Chat'),
        };
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    }
  }

  Future<void> _loadMessages() async {
    try {
      final supabase = Supabase.instance.client;
      
      final result = await supabase
          .from('messages')
          .select('''
            *,
            sender:profiles!messages_sender_id_fkey(username, avatar_url)
          ''')
          .eq('conversation_id', widget.conversationId)
          .order('created_at', ascending: true);

      setState(() {
        messages = result.data;
        loading = false;
      });

      // Scroll to bottom
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        }
      });

      // Mark messages as read
      await _markAsRead();
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  Future<void> _markAsRead() async {
    final user = context.read<AuthProvider>().user;
    if (user == null) return;

    try {
      final supabase = Supabase.instance.client;
      await supabase
          .from('conversation_participants')
          .update({'last_read_at': DateTime.now().toIso8601String()})
          .eq('conversation_id', widget.conversationId)
          .eq('user_id', user.id);
    } catch (e) {
      // Ignore errors for read status
    }
  }

  void _subscribeToMessages() {
    final supabase = Supabase.instance.client;
    
    supabase
        .channel('messages:${widget.conversationId}')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'messages',
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'conversation_id',
            value: widget.conversationId,
          ),
          callback: (payload) {
            _loadMessages();
          },
        )
        .subscribe();
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.trim().isEmpty) return;
    
    final user = context.read<AuthProvider>().user;
    if (user == null) return;

    final messageText = _messageController.text.trim();
    _messageController.clear();

    try {
      final supabase = Supabase.instance.client;
      await supabase.from('messages').insert({
        'conversation_id': widget.conversationId,
        'sender_id': user.id,
        'content': messageText,
      });
    } catch (e) {
      // Show error
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to send message: $e')),
        );
      }
    }
  }

  String _formatTime(String dateString) {
    final date = DateTime.parse(dateString);
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'now';
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.read<AuthProvider>().user;
    
    return Scaffold(
      appBar: AppBar(
        title: conversation != null
            ? Row(
                children: [
                  if (conversation!['other_participants'].isNotEmpty)
                    CircleAvatar(
                      radius: 16,
                      backgroundImage: conversation!['other_participants'][0]['avatar_url'] != null
                          ? NetworkImage(conversation!['other_participants'][0]['avatar_url'])
                          : null,
                      child: conversation!['other_participants'][0]['avatar_url'] == null
                          ? Text(
                              conversation!['title'][0].toUpperCase(),
                              style: const TextStyle(fontSize: 12),
                            )
                          : null,
                    ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          conversation!['title'],
                          style: const TextStyle(fontSize: 16),
                        ),
                        const Text(
                          'Online',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.successColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              )
            : const Text('Chat'),
        actions: [
          IconButton(
            onPressed: () {
              // TODO: Video call
            },
            icon: const Icon(Icons.videocam),
          ),
          IconButton(
            onPressed: () {
              // TODO: Voice call
            },
            icon: const Icon(Icons.call),
          ),
          IconButton(
            onPressed: () {
              // TODO: More options
            },
            icon: const Icon(Icons.more_vert),
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages List
          Expanded(
            child: Container(
              decoration: const BoxDecoration(
                gradient: AppTheme.backgroundGradient,
              ),
              child: loading
                  ? const Center(child: CircularProgressIndicator())
                  : error != null
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.error_outline, size: 64, color: Colors.red),
                              const SizedBox(height: 16),
                              Text('Failed to load messages: $error'),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _loadMessages,
                                child: const Text('Retry'),
                              ),
                            ],
                          ),
                        )
                      : messages.isEmpty
                          ? const Center(
                              child: Text(
                                'No messages yet\nStart the conversation!',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey,
                                ),
                              ),
                            )
                          : ListView.builder(
                              controller: _scrollController,
                              padding: const EdgeInsets.all(16),
                              itemCount: messages.length,
                              itemBuilder: (context, index) {
                                final message = messages[index];
                                final isMe = message['sender_id'] == user?.id;
                                final sender = message['sender'];
                                
                                return _MessageBubble(
                                  message: message['content'] ?? '',
                                  isMe: isMe,
                                  time: _formatTime(message['created_at']),
                                  senderName: sender?['username'] ?? 'Unknown',
                                  avatarUrl: sender?['avatar_url'],
                                );
                              },
                            ),
            ),
          ),
          
          // Message Input
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              children: [
                IconButton(
                  onPressed: () {
                    // TODO: Attach file
                  },
                  icon: const Icon(Icons.attach_file),
                ),
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'Type a message...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                    ),
                    maxLines: null,
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  decoration: const BoxDecoration(
                    gradient: AppTheme.primaryGradient,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    onPressed: _sendMessage,
                    icon: const Icon(
                      Icons.send,
                      color: Colors.white,
                    ),
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

class _MessageBubble extends StatelessWidget {
  final String message;
  final bool isMe;
  final String time;
  final String senderName;
  final String? avatarUrl;

  const _MessageBubble({
    required this.message,
    required this.isMe,
    required this.time,
    required this.senderName,
    this.avatarUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!isMe) ...[
            CircleAvatar(
              radius: 16,
              backgroundImage: avatarUrl != null ? NetworkImage(avatarUrl!) : null,
              child: avatarUrl == null
                  ? Text(
                      senderName[0].toUpperCase(),
                      style: const TextStyle(fontSize: 12),
                    )
                  : null,
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
              decoration: BoxDecoration(
                gradient: isMe ? AppTheme.primaryGradient : null,
                color: isMe ? null : Colors.white,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message,
                    style: TextStyle(
                      color: isMe ? Colors.white : Colors.black87,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    time,
                    style: TextStyle(
                      color: isMe ? Colors.white70 : Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (isMe) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              child: Text(
                'Me'[0],
                style: const TextStyle(fontSize: 12),
              ),
            ),
          ],
        ],
      ),
    );
  }
}