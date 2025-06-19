package com.mavent.dev.filter;

import com.mavent.dev.service.AccountService;
import com.mavent.dev.service.JwtBlacklistService;
import com.mavent.dev.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AccountService accountService;
    private final JwtBlacklistService blacklistService;

    public JwtFilter(JwtUtil jwtUtil, AccountService accountService, JwtBlacklistService blacklistService) {
        this.jwtUtil = jwtUtil;
        this.accountService = accountService;
        this.blacklistService = blacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            final String token = authHeader.substring(7);
//            System.out.println("JWT Token: " + token); // Debugging line to log the token
            if (blacklistService.isTokenBlacklisted(token)) {
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is blacklisted");
                return;
            }

            try {
                final String username = jwtUtil.extractUsername(token);
                if (!jwtUtil.isTokenValid(token, accountService.getAccount(username))) {
//                    System.out.println("Invalid token for user: " + username); // Debugging line for invalid token
                    SecurityContextHolder.getContext().setAuthentication(null);
                }
//            else {
//                System.out.println("Token is valid for user: " + username); // Debugging line to confirm token validity
//            }

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    List<String> roles = jwtUtil.extractRoles(token);
                    List<SimpleGrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                System.err.println("JwtFilter.java: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
