import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cook_ideas/core/providers/auth_provider.dart';
import 'package:cook_ideas/core/theme/app_theme.dart';
import 'package:cook_ideas/shared/widgets/custom_text_field.dart';
import 'package:cook_ideas/shared/widgets/gradient_button.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _bioController = TextEditingController();
  final _skillsController = TextEditingController();
  final _interestsController = TextEditingController();
  
  File? _avatarImage;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  void _loadProfileData() {
    final profile = context.read<AuthProvider>().profile;
    if (profile != null) {
      _firstNameController.text = profile.firstName ?? '';
      _lastNameController.text = profile.lastName ?? '';
      _bioController.text = profile.bio ?? '';
      _skillsController.text = profile.skills?.join(', ') ?? '';
      _interestsController.text = profile.interests?.join(', ') ?? '';
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _bioController.dispose();
    _skillsController.dispose();
    _interestsController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 512,
      maxHeight: 512,
      imageQuality: 80,
    );

    if (pickedFile != null) {
      setState(() {
        _avatarImage = File(pickedFile.path);
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() {
      _isLoading = true;
    });
    
    final authProvider = context.read<AuthProvider>();
    final currentProfile = authProvider.profile!;
    
    final updatedProfile = currentProfile.copyWith(
      firstName: _firstNameController.text.trim(),
      lastName: _lastNameController.text.trim(),
      fullName: '${_firstNameController.text.trim()} ${_lastNameController.text.trim()}',
      bio: _bioController.text.trim().isEmpty ? null : _bioController.text.trim(),
      skills: _skillsController.text.trim().isEmpty 
          ? null 
          : _skillsController.text.split(',').map((s) => s.trim()).where((s) => s.isNotEmpty).toList(),
      interests: _interestsController.text.trim().isEmpty 
          ? null 
          : _interestsController.text.split(',').map((s) => s.trim()).where((s) => s.isNotEmpty).toList(),
    );
    
    final success = await authProvider.updateProfile(updatedProfile);
    
    setState(() {
      _isLoading = false;
    });
    
    if (success && mounted) {
      context.pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profile updated successfully!'),
          backgroundColor: AppTheme.successColor,
        ),
      );
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(authProvider.error ?? 'Failed to update profile'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.close),
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppTheme.backgroundGradient,
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                // Avatar Section
                Consumer<AuthProvider>(
                  builder: (context, authProvider, child) {
                    final profile = authProvider.profile;
                    return GestureDetector(
                      onTap: _pickImage,
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppTheme.primaryColor,
                            width: 3,
                          ),
                        ),
                        child: ClipOval(
                          child: _avatarImage != null
                              ? Image.file(
                                  _avatarImage!,
                                  fit: BoxFit.cover,
                                )
                              : profile?.avatarUrl != null
                                  ? Image.network(
                                      profile!.avatarUrl!,
                                      fit: BoxFit.cover,
                                    )
                                  : Container(
                                      color: Colors.grey[200],
                                      child: const Icon(
                                        Icons.camera_alt,
                                        size: 40,
                                        color: AppTheme.primaryColor,
                                      ),
                                    ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 8),
                const Text(
                  'Tap to change photo',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
                
                const SizedBox(height: 32),
                
                // Form Fields
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: CustomTextField(
                                controller: _firstNameController,
                                label: 'First Name',
                                prefixIcon: Icons.person_outline,
                                validator: (value) {
                                  if (value?.isEmpty ?? true) {
                                    return 'Required';
                                  }
                                  return null;
                                },
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: CustomTextField(
                                controller: _lastNameController,
                                label: 'Last Name',
                                prefixIcon: Icons.person_outline,
                                validator: (value) {
                                  if (value?.isEmpty ?? true) {
                                    return 'Required';
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ],
                        ),
                        
                        const SizedBox(height: 20),
                        
                        CustomTextField(
                          controller: _bioController,
                          label: 'Bio',
                          hint: 'Tell us about yourself...',
                          prefixIcon: Icons.info_outline,
                          maxLines: 3,
                          validator: null,
                        ),
                        
                        const SizedBox(height: 20),
                        
                        CustomTextField(
                          controller: _skillsController,
                          label: 'Skills',
                          hint: 'JavaScript, React, Design, etc. (comma separated)',
                          prefixIcon: Icons.star_outline,
                          validator: null,
                        ),
                        
                        const SizedBox(height: 20),
                        
                        CustomTextField(
                          controller: _interestsController,
                          label: 'Interests',
                          hint: 'Technology, Startups, AI, etc. (comma separated)',
                          prefixIcon: Icons.favorite_outline,
                          validator: null,
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: 32),
                
                // Submit Button
                GradientButton(
                  onPressed: _isLoading ? null : _handleSubmit,
                  child: _isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text(
                          'Save Changes',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}