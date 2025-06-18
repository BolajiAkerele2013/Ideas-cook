class UserProfile {
  final String id;
  final String username;
  final String? firstName;
  final String? lastName;
  final String? fullName;
  final String? avatarUrl;
  final String? bio;
  final List<String>? skills;
  final List<String>? interests;
  final DateTime createdAt;
  final DateTime updatedAt;
  
  UserProfile({
    required this.id,
    required this.username,
    this.firstName,
    this.lastName,
    this.fullName,
    this.avatarUrl,
    this.bio,
    this.skills,
    this.interests,
    required this.createdAt,
    required this.updatedAt,
  });
  
  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'],
      username: json['username'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      fullName: json['full_name'],
      avatarUrl: json['avatar_url'],
      bio: json['bio'],
      skills: json['skills']?.cast<String>(),
      interests: json['interests']?.cast<String>(),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'first_name': firstName,
      'last_name': lastName,
      'full_name': fullName,
      'avatar_url': avatarUrl,
      'bio': bio,
      'skills': skills,
      'interests': interests,
      'updated_at': DateTime.now().toIso8601String(),
    };
  }
  
  UserProfile copyWith({
    String? username,
    String? firstName,
    String? lastName,
    String? fullName,
    String? avatarUrl,
    String? bio,
    List<String>? skills,
    List<String>? interests,
  }) {
    return UserProfile(
      id: id,
      username: username ?? this.username,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      fullName: fullName ?? this.fullName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      bio: bio ?? this.bio,
      skills: skills ?? this.skills,
      interests: interests ?? this.interests,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }
  
  String get displayName {
    if (fullName?.isNotEmpty == true) return fullName!;
    if (firstName?.isNotEmpty == true && lastName?.isNotEmpty == true) {
      return '$firstName $lastName';
    }
    return username;
  }
}