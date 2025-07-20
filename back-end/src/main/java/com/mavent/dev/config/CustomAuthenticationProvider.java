package com.mavent.dev.config;

import com.mavent.dev.entity.Account;
import com.mavent.dev.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final AccountService accountService;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public CustomAuthenticationProvider(AccountService accountService, PasswordEncoder passwordEncoder) {
        this.accountService = accountService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String rawPassword = authentication.getCredentials().toString();

        try {
            UserDetails userDetails = accountService.loadUserByUsername(username);
            
            if (userDetails == null || !passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
                throw new BadCredentialsException("Invalid username or password");
            }
            
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        } catch (UsernameNotFoundException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.equals(authentication);
    }
}
