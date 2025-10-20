package de.revel8.challenge.bank.service;

import de.revel8.challenge.bank.model.Account;
import de.revel8.challenge.bank.model.Transfer;
import de.revel8.challenge.bank.repository.AccountRepository;
import org.springframework.stereotype.Service;

/**
 * Service class for money operations.
 */
@Service
public class MoneyService {

    private final AccountRepository accountRepository;

    public MoneyService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public void deposit(String accountId, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }

        Account account = accountRepository.getAccountById(accountId);
        if (account == null) {
            throw new IllegalArgumentException("Account not found");
        }

        synchronized (account) {
            account.setBalance(account.getBalance() + amount);
        }
    }

    public void withdraw(String accountId, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }

        Account account = accountRepository.getAccountById(accountId);
        if (account == null) {
            throw new IllegalArgumentException("Account not found");
        }

        synchronized (account) {
            if (account.getBalance() < amount) {
                throw new IllegalArgumentException("Insufficient funds");
            }
            account.setBalance(account.getBalance() - amount);
        }
    }

    public void transfer(String fromAccountId, String toAccountId, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }

        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        Account fromAccount = accountRepository.getAccountById(fromAccountId);
        Account toAccount = accountRepository.getAccountById(toAccountId);

        if (fromAccount == null) {
            throw new IllegalArgumentException("Source account not found");
        }
        if (toAccount == null) {
            throw new IllegalArgumentException("Destination account not found");
        }

        // Integrated lock ordering to prevent deadlocks when
        // transferring money between two accounts.

        Account firstLock = fromAccountId.compareTo(toAccountId) < 0 ? fromAccount : toAccount;
        Account secondLock = fromAccountId.compareTo(toAccountId) < 0 ? toAccount : fromAccount;

        synchronized (firstLock) {
            synchronized (secondLock) {
                if (fromAccount.getBalance() < amount) {
                    throw new IllegalArgumentException("Insufficient funds");
                }

                fromAccount.setBalance(fromAccount.getBalance() - amount);
                toAccount.setBalance(toAccount.getBalance() + amount);

                Transfer transfer = new Transfer(fromAccountId, toAccountId, amount);
                fromAccount.addOutgoingTransfer(transfer);
            }
        }
    }
}
