
package com.dev2life.backend.config;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private final FirebaseApp firebaseApp;

    public FirebaseTokenFilter(FirebaseApp firebaseApp) {
        this.firebaseApp = firebaseApp;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getServletPath().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            response.sendError(401, "Token Firebase ausente.");
            return;
        }

        String token = authorization.substring(7);

        try {
            FirebaseToken decodedToken =
                    FirebaseAuth.getInstance(firebaseApp)
                            .verifyIdToken(token);

            request.setAttribute("firebaseUid", decodedToken.getUid());

            filterChain.doFilter(request, response);

        } catch (FirebaseAuthException | IllegalArgumentException e) {
            response.sendError(401, "Token Firebase inválido.");
        }
    }
}
