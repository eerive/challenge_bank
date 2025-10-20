package de.revel8.challenge.bank.dto;

public record ErrorResponseDto(
        String error,
        String message) {
}
