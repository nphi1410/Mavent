package com.mavent.dev.service.implement;

import com.mavent.dev.DTO.UserProfileDTO;
import com.mavent.dev.entity.Account;
import com.mavent.dev.repository.AccountRepository;
import com.mavent.dev.service.AccountService;
//import com.mavent.dev.service.S3UploaderService; // <-- Import S3UploaderService mới
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
public class AccountImplement implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

//    @Autowired
//    private S3UploaderService s3UploaderService; // <-- Inject S3UploaderService mới thay vì CloudConfig

    @Override
    public void register(Account accountInfo) {
        accountRepository.save(accountInfo);
    }

    @Override
    public UserProfileDTO getUserProfile(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with username: " + username));
        return mapAccountToUserProfileDTO(account);
    }

    @Override
    public void updateProfile(String username, UserProfileDTO userProfileDTO) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with username: " + username));

        account.setEmail(userProfileDTO.getEmail());
        account.setFullName(userProfileDTO.getFullName());
        account.setPhone(userProfileDTO.getPhone());
        account.setGender(userProfileDTO.getGender());

        accountRepository.save(account);
    }

    @Override
    public String uploadAvatar(String username, MultipartFile avatarFile) throws IOException {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with username: " + username));

        if (avatarFile.isEmpty()) {
            throw new IllegalArgumentException("Avatar file cannot be empty.");
        }
        if (!isImageFile(avatarFile)) {
            throw new IllegalArgumentException("Only image files (JPEG, PNG, GIF) are allowed for avatar.");
        }

        // Tải file lên dịch vụ đám mây bằng S3UploaderService
        String avatarUrl = "";
//                s3UploaderService.uploadFile(avatarFile, "avatars"); // "avatars" là thư mục trong bucket

        account.setAvatarImg(avatarUrl);
        accountRepository.save(account);

        return avatarUrl;
    }

    @Override
    public String uploadAvatar(String username, byte[] avatarBytes, String fileName) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with username: " + username));

        if (avatarBytes == null || avatarBytes.length == 0) {
            throw new IllegalArgumentException("Avatar file cannot be empty.");
        }
        // You may want to add more checks for file type based on fileName if needed

        String avatarUrl = "";
//                s3UploaderService.uploadFile(avatarBytes, fileName, "avatars");
        account.setAvatarImg(avatarUrl);
        accountRepository.save(account);
        return avatarUrl;
    }

    @Override
    public boolean checkLogin(String username, String password) {
        // Find account by username
        Account account = accountRepository.findByUsername(username).orElse(null);
        if (account == null) {
//            System.out.println("Account not found for username: " + username);
            return false;
        }
//        System.out.println("Checking login for user: " + username);
//        System.out.println("Stored password hash: " + account.getPasswordHash());
        // Compare raw password with stored hash (for demo, plain text; for real, use BCrypt)
        // Example for plain text (NOT recommended for production):
        return account.getPasswordHash().equals(password);
        // If using BCrypt:
        // return passwordEncoder.matches(password, account.getPasswordHash());
    }

    @Override
    public List<Account> findAllAccount() {
        return accountRepository.findAll();
    }

    private UserProfileDTO mapAccountToUserProfileDTO(Account account) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(account.getAccountId());
        dto.setUsername(account.getUsername());
        dto.setEmail(account.getEmail());
        dto.setFullName(account.getFullName());
        dto.setAvatarImg(account.getAvatarImg());
        dto.setPhone(account.getPhone());
        dto.setGender(account.getGender());
        return dto;
    }

    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/gif"));
    }
}

