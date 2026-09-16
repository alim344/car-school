package com.example.carschool.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;

@Entity(name = "roles")
@Getter @Setter
public class Role implements GrantedAuthority {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column
    private String role;

    public Role() { }

    public Role(Long id, String role) {
        this.id = id;
        this.role = role;
    }

    public Role(String name) {
        this.role = name;
    }


    @Override
    public @Nullable String getAuthority() {
        return role;
    }
}
