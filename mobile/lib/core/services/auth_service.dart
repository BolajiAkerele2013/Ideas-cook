import 'dart:io';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cook_ideas/features/auth/models/user_profile.dart';
import 'package:cook_ideas/core/config/app_config.dart';

class AuthService {
  final SupabaseClient _client = Supabase.instance.client;
  
  Future<void> signIn(String email, String password) async {
    final response = await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
    
    if (response.user == null) {
      throw Exception('Login failed');
    }
  }
  
  Future<void> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? avatarPath,
  }) async {
    final response = await _client.auth.signUp(
      email: email,
      password: password,
    );
    
    if (response.user == null) {
      throw Exception('Registration failed');
    }
    
    String? avatarUrl;
    if (avatarPath != null) {
      avatarUrl = await _uploadAvatar(response.user!.id, avatarPath);
    }
    
    // Create profile
    await _client.from('profiles').insert({
      'id': response.user!.id,
      'username': email,
      'first_name': firstName,
      'last_name': lastName,
      'full_name': '$firstName $lastName'.trim(),
      'avatar_url': avatarUrl,
    });
  }
  
  Future<String?> _uploadAvatar(String userId, String filePath) async {
    final file = File(filePath);
    final fileExt = filePath.split('.').last;
    final fileName = '$userId/avatar.$fileExt';
    
    await _client.storage
        .from(AppConfig.avatarsBucket)
        .upload(fileName, file, fileOptions: const FileOptions(upsert: true));
    
    return _client.storage
        .from(AppConfig.avatarsBucket)
        .getPublicUrl(fileName);
  }
  
  Future<UserProfile> getProfile(String userId) async {
    final response = await _client
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();
    
    return UserProfile.fromJson(response);
  }
  
  Future<void> updateProfile(UserProfile profile) async {
    await _client
        .from('profiles')
        .update(profile.toJson())
        .eq('id', profile.id);
  }
  
  Future<void> signOut() async {
    await _client.auth.signOut();
  }
}