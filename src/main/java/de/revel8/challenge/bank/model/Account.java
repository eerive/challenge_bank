package de.revel8.challenge.bank.model;

import java.util.ArrayList;
import java.util.List;

public class Account {

    private String accountId;
    private double balance;

    // Store last 50 outgoing transfers 
    private final int MAX_TRANSFERS = 50;
    private Transfer[] recentTransfers = new Transfer[MAX_TRANSFERS];
    private int transferIndex = 0;
    private int numTransfers = 0;

    public Account(String accountId) {
        this.accountId = accountId;
        this.balance = 0.0;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public synchronized void addOutgoingTransfer(Transfer transfer) {
        recentTransfers[transferIndex] = transfer;
        transferIndex = (transferIndex + 1) % MAX_TRANSFERS;
        if (numTransfers < MAX_TRANSFERS)
            numTransfers++;
    }

    public synchronized List<Transfer> getRecentTransfers() {
        List<Transfer> result = new ArrayList<>();
        for (int i = 0; i < numTransfers; i++) {
            int idx = (transferIndex - numTransfers + i + MAX_TRANSFERS) % MAX_TRANSFERS;
            result.add(recentTransfers[idx]);
        }
        return result;
    }
}
