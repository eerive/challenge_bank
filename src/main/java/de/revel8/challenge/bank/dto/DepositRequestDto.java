package de.revel8.challenge.bank.dto;

public record DepositRequestDto(
        String accountId,
        double amount) {
}
