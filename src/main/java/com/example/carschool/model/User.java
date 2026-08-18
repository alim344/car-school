package com.example.carschool.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;

@Entity( name = "users")
@Getter @Setter
@Inheritance(strategy = InheritanceType.JOINED)
public class User implements UserDetails {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    private String username;

    @Column
    @JsonIgnore
    private String password;

    @Column(unique = true,nullable = false)
    private String email;

    @Column
    private String name;

    @Column
    private String lastname;

    @Column
    private boolean enabled = false;


    @Column
    private Timestamp lastPasswordResetDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(role);
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    public void setPassword(String password) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        this.setLastPasswordResetDate(now);
        this.password = password;
    }
}
