package com.example.carschool.config;


import com.example.carschool.security_auth.RestAuthenticationEntryPoint;
import com.example.carschool.security_auth.TokenAuthenticationFilter;
import com.example.carschool.service.CustomUserDetailsService;
import com.example.carschool.util.TokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
public class WebSecurityConfig {


    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());

        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }



    @Autowired
    private RestAuthenticationEntryPoint restAuthenticationEntryPoint;


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Autowired
    private TokenUtils tokenUtils;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.exceptionHandling(exception -> exception.authenticationEntryPoint(restAuthenticationEntryPoint));

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/foo").permitAll()
                .requestMatchers("/schedule/cand/*","/pref/**","/p-exam/cand/*","/practical-class/report","/practical-class/getProfile").hasAuthority("ROLE_CANDIDATE")
                .requestMatchers("/practical-class/**","/instructor/dashboard","/route/*","/schedule/inst/*","/p-exam/inst/*", "/vehicle/inst/**","/car-request/inst/*","/fuel/**").hasAuthority("ROLE_INSTRUCTOR")
                .requestMatchers("/practical-class/cancel/*").hasAnyAuthority("ROLE_CANDIDATE","ROLE_INSTRUCTOR")
                .requestMatchers("/p-exam/admin/*","/instructor/getAll","/candidate/pending","/car-request/*").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/vehicle/inst/out-of-service/*","/vehicle/***","/leave/**").hasAnyAuthority("ROLE_INSTRUCTOR", "ROLE_ADMIN")
                .requestMatchers("/p-exam/cancel").hasAnyAuthority("ROLE_CANDIDATE","ROLE_ADMIN")
                .requestMatchers(
                        "/favicon.ico",
                        "/webjars/**",
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/static/**"
                ).permitAll()


                .anyRequest().authenticated()
        );

        http.cors(cors -> cors.configure(http));

        http.csrf(csrf -> csrf.disable());

        http.addFilterBefore(new TokenAuthenticationFilter(tokenUtils,  userDetailsService()), BasicAuthenticationFilter.class);

        http.authenticationProvider(authenticationProvider());

        return http.build();
    }

}
