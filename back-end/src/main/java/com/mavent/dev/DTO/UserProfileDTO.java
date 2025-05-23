package com.mavent.dev.DTO;

public class UserProfileDTO {
    private String username;
    private String email;
    private String fullName;
    private String avatarImg;
    private String phone;
    private String gender;
    private String role;

    public UserProfileDTO() {
    }

    public UserProfileDTO(String username, String email, String fullName,
                          String avatarImg, String phone, String gender) {
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.avatarImg = avatarImg;
        this.phone = phone;
        this.gender = gender;
    }

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAvatarImg() { return avatarImg; }
    public void setAvatarImg(String avatarImg) { this.avatarImg = avatarImg; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}