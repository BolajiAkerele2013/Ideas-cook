class AppConfig {
  static const String supabaseUrl = 'https://bmafykhjzypxdqtdnspz.supabase.co';
  static const String supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtYWZ5a2hqenlweGRxdGRuc3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5Mzk5NDQsImV4cCI6MjA2NTUxNTk0NH0.vQ0NRS4qNs6YefOZCOcK3CYuBg8hh9KI-g-3oHDqTTY';
  
  static const String appName = 'Cook.ideas';
  static const String appVersion = '1.0.0';
  
  // API Endpoints
  static const String baseUrl = supabaseUrl;
  
  // Storage buckets
  static const String avatarsBucket = 'avatars';
  static const String documentsBucket = 'documents';
  static const String attachmentsBucket = 'task-attachments';
}