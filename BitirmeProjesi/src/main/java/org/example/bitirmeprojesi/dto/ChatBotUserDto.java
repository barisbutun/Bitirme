package org.example.bitirmeprojesi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.example.bitirmeprojesi.enums.Role;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link org.example.bitirmeprojesi.entity.User}
 */
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
public class ChatBotUserDto implements Serializable {

    private String name;

    boolean registered;

    private String email;

    private Role role;

    private String phone;

    private String address;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Double balance;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<ShoppingCartItemDto> shoppingCartItems;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<OrdersDto> orders;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<ReviewDto> reviews;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<FavouriteDto> favourites;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<PaymentDto> payment;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<CancellationDto> cancellation;
}