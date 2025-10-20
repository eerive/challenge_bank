package de.revel8.challenge.bank;

import de.revel8.challenge.bank.model.Account;
import de.revel8.challenge.bank.model.Transfer;
import de.revel8.challenge.bank.repository.AccountRepository;
import de.revel8.challenge.bank.service.MoneyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TransferHistoryTest {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MoneyService moneyService;

    private String sourceAccountId;
    private String destinationAccountId;

    @BeforeEach
    void setUp() {
        // Create two accounts for testing
        Account sourceAccount = accountRepository.createAccount();
        Account destinationAccount = accountRepository.createAccount();

        sourceAccountId = sourceAccount.getAccountId();
        destinationAccountId = destinationAccount.getAccountId();

        moneyService.deposit(sourceAccountId, 10000.0);
    }

    @Test
    void testMaximum50TransfersAreStored() {
        for (int i = 1; i <= 50; i++) {
            moneyService.transfer(sourceAccountId, destinationAccountId, 1.0);
        }

        Account account = accountRepository.getAccountById(sourceAccountId);
        List<Transfer> transfers = account.getRecentTransfers();

        assertEquals(50, transfers.size(), "Should store exactly 50 transfers");
    }

    /**
     * Make exactly 100 transfers (50 over the limit) and keep #51 to #100
     */
    @Test
    void testExactly100TransfersKeepsLast50() {
        for (int i = 1; i <= 100; i++) {
            moneyService.transfer(sourceAccountId, destinationAccountId, (double) i);
        }

        Account account = accountRepository.getAccountById(sourceAccountId);
        List<Transfer> transfers = account.getRecentTransfers();

        assertEquals(50, transfers.size(), "Should only keep last 50 transfers");

        assertEquals(51.0, transfers.get(0).getAmount(), 0.001,
                "First transfer should be #51");
        assertEquals(100.0, transfers.get(49).getAmount(), 0.001,
                "Last transfer should be #100");
    }

}
