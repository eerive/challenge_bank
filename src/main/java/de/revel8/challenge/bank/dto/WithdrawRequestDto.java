package de.revel8.challenge.bank.dto;

public record WithdrawRequestDto(
        String accountId,
        double amount) {
}
