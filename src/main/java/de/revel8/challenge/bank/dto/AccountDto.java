package de.revel8.challenge.bank.dto;

import de.revel8.challenge.bank.model.Transfer;

import java.util.List;

public record AccountDto(
        String accountId,
        double balance,
        List<Transfer> recentTransfers) {
}
