package de.revel8.challenge.bank.service;

import de.revel8.challenge.bank.dto.AccountDto;
import de.revel8.challenge.bank.model.Account;
import de.revel8.challenge.bank.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for account operations.
 */
@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public AccountDto createAccount() {
        Account account = accountRepository.createAccount();

        return convertToDto(account);
    }

    public AccountDto getAccountById(String accountId) {
        Account account = accountRepository.getAccountById(accountId);
        if (account == null) {
            return null;
        }

        return convertToDto(account);
    }

    public List<AccountDto> getAllAccounts() {
        return accountRepository.getAllAccounts().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private AccountDto convertToDto(Account account) {
        return new AccountDto(
                account.getAccountId(),
                account.getBalance(),
                account.getRecentTransfers());
    }
}
