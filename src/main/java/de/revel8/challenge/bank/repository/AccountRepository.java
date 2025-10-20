package de.revel8.challenge.bank.repository;

import de.revel8.challenge.bank.model.Account;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple repository using a ConcurrentHashMap for account management
 * for storing accounts in memory
 */
@Repository
public class AccountRepository {
    private final ConcurrentHashMap<String, Account> accounts = new ConcurrentHashMap<>();

    public Account createAccount() {
        String accountId = UUID.randomUUID().toString();
        Account account = new Account(accountId);
        accounts.put(accountId, account);
        
        return account;
    }

    public Account getAccountById(String accountId) {
        return accounts.get(accountId);
    }

    public boolean accountExists(String accountId) {
        return accounts.containsKey(accountId);
    }

    public Collection<Account> getAllAccounts() {
        return accounts.values();
    }
}
