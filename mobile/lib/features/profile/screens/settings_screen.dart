import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:cook_ideas/core/providers/theme_provider.dart';
import 'package:cook_ideas/core/theme/app_theme.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _fontSize = 'medium';
  bool _notificationsEnabled = true;
  bool _soundEnabled = true;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _fontSize = prefs.getString('fontSize') ?? 'medium';
      _notificationsEnabled = prefs.getBool('notificationsEnabled') ?? true;
      _soundEnabled = prefs.getBool('soundEnabled') ?? true;
    });
  }

  Future<void> _saveFontSize(String size) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('fontSize', size);
    setState(() {
      _fontSize = size;
    });
  }

  Future<void> _saveNotificationSetting(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notificationsEnabled', enabled);
    setState(() {
      _notificationsEnabled = enabled;
    });
  }

  Future<void> _saveSoundSetting(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('soundEnabled', enabled);
    setState(() {
      _soundEnabled = enabled;
    });
  }

  double _getFontSizeValue() {
    switch (_fontSize) {
      case 'small':
        return 12.0;
      case 'large':
        return 18.0;
      default:
        return 14.0;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.arrow_back),
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppTheme.backgroundGradient,
        ),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Appearance Section
            _SectionHeader(title: 'Appearance'),
            Card(
              child: Column(
                children: [
                  Consumer<ThemeProvider>(
                    builder: (context, themeProvider, child) {
                      return SwitchListTile(
                        title: const Text('Dark Mode'),
                        subtitle: const Text('Switch between light and dark themes'),
                        value: themeProvider.isDarkMode,
                        onChanged: (value) {
                          themeProvider.toggleTheme();
                        },
                        secondary: Icon(
                          themeProvider.isDarkMode 
                              ? Icons.dark_mode 
                              : Icons.light_mode,
                          color: AppTheme.primaryColor,
                        ),
                      );
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(
                      Icons.text_fields,
                      color: AppTheme.primaryColor,
                    ),
                    title: const Text('Font Size'),
                    subtitle: Text('Current: ${_fontSize.toUpperCase()}'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () => _showFontSizeDialog(),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Notifications Section
            _SectionHeader(title: 'Notifications'),
            Card(
              child: Column(
                children: [
                  SwitchListTile(
                    title: const Text('Push Notifications'),
                    subtitle: const Text('Receive notifications for messages and updates'),
                    value: _notificationsEnabled,
                    onChanged: _saveNotificationSetting,
                    secondary: const Icon(
                      Icons.notifications,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('Sound'),
                    subtitle: const Text('Play sound for notifications'),
                    value: _soundEnabled,
                    onChanged: _saveSoundSetting,
                    secondary: const Icon(
                      Icons.volume_up,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Account Section
            _SectionHeader(title: 'Account'),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(
                      Icons.person,
                      color: AppTheme.primaryColor,
                    ),
                    title: const Text('Edit Profile'),
                    subtitle: const Text('Update your profile information'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () => context.push('/profile/edit'),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(
                      Icons.lock,
                      color: AppTheme.primaryColor,
                    ),
                    title: const Text('Change Password'),
                    subtitle: const Text('Update your password'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () => context.push('/auth/forgot-password'),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Privacy Section
            _SectionHeader(title: 'Privacy & Security'),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(
                      Icons.privacy_tip,
                      color: AppTheme.primaryColor,
                    ),
                    title: const Text('Privacy Policy'),
                    subtitle: const Text('Read our privacy policy'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Privacy Policy coming soon!'),
                        ),
                      );
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(
                      Icons.description,
                      color: AppTheme.primaryColor,
                    ),
                    title: const Text('Terms of Service'),
                    subtitle: const Text('Read our terms of service'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Terms of Service coming soon!'),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // About Section
            _SectionHeader(title: 'About'),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(
                      Icons.info,
                      color: AppTheme.primaryColor,
                    ),
                    title: const Text('App Version'),
                    subtitle: const Text('1.0.0'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      showAboutDialog(
                        context: context,
                        applicationName: 'Cook.ideas',
                        applicationVersion: '1.0.0',
                        applicationIcon: Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            gradient: AppTheme.primaryGradient,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.lightbulb,
                            color: Colors.white,
                            size: 30,
                          ),
                        ),
                        children: [
                          const Text(
                            'Cook.ideas is a platform for creating, managing, and collaborating on innovative ideas.',
                          ),
                        ],
                      );
                    },
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Font Size Preview
            if (_fontSize != 'medium') ...[
              _SectionHeader(title: 'Font Size Preview'),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    'This is how text will appear with the ${_fontSize} font size setting.',
                    style: TextStyle(
                      fontSize: _getFontSizeValue(),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _showFontSizeDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Choose Font Size'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile<String>(
              title: const Text('Small'),
              value: 'small',
              groupValue: _fontSize,
              onChanged: (value) {
                if (value != null) {
                  _saveFontSize(value);
                  Navigator.of(context).pop();
                }
              },
            ),
            RadioListTile<String>(
              title: const Text('Medium'),
              value: 'medium',
              groupValue: _fontSize,
              onChanged: (value) {
                if (value != null) {
                  _saveFontSize(value);
                  Navigator.of(context).pop();
                }
              },
            ),
            RadioListTile<String>(
              title: const Text('Large'),
              value: 'large',
              groupValue: _fontSize,
              onChanged: (value) {
                if (value != null) {
                  _saveFontSize(value);
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, bottom: 8, top: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: AppTheme.primaryColor,
        ),
      ),
    );
  }
}