package de.revel8.challenge.bank.dto;

public record TransferRequestDto(
        String fromAccountId,
        String toAccountId,
        double amount) {
}
