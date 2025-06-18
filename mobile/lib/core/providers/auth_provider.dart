import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:cook_ideas/features/auth/models/user_profile.dart';
import 'package:cook_ideas/core/services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _user;
  UserProfile? _profile;
  bool _isLoading = false;
  String? _error;
  
  User? get user => _user;
  UserProfile? get profile => _profile;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  
  AuthProvider() {
    _initializeAuth();
  }
  
  void _initializeAuth() {
    _user = Supabase.instance.client.auth.currentUser;
    if (_user != null) {
      _loadProfile();
    }
    
    // Listen to auth state changes
    Supabase.instance.client.auth.onAuthStateChange.listen((data) {
      _user = data.session?.user;
      if (_user != null) {
        _loadProfile();
      } else {
        _profile = null;
      }
      notifyListeners();
    });
  }
  
  Future<void> _loadProfile() async {
    if (_user == null) return;
    
    try {
      _profile = await _authService.getProfile(_user!.id);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }
  
  Future<bool> signIn(String email, String password) async {
    _setLoading(true);
    _clearError();
    
    try {
      await _authService.signIn(email, password);
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<bool> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? avatarPath,
  }) async {
    _setLoading(true);
    _clearError();
    
    try {
      await _authService.signUp(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        avatarPath: avatarPath,
      );
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  Future<void> signOut() async {
    await _authService.signOut();
    _user = null;
    _profile = null;
    notifyListeners();
  }
  
  Future<bool> updateProfile(UserProfile profile) async {
    _setLoading(true);
    _clearError();
    
    try {
      await _authService.updateProfile(profile);
      _profile = profile;
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _setLoading(false);
    }
  }
  
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
  
  void _clearError() {
    _error = null;
    notifyListeners();
  }
}