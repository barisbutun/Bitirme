package dto;

import enums.Role;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link entity.User}
 */
@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class UserDto implements Serializable {

    private Long id;

    private String name;

    private boolean registered;

    private String password;

    private String email;

    private Role role;
}