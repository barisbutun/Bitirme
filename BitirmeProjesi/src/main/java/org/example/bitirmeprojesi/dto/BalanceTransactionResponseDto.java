package org.example.bitirmeprojesi.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BalanceTransactionResponseDto {
    @JsonProperty("amount")
    private double amount;
    @JsonProperty("description")
    private String description;
    @JsonProperty("transaction_date")
    private LocalDateTime transactionDate;
}
