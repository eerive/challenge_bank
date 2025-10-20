package de.revel8.challenge.bank.model;

import java.util.Date;

/**
 * Model for transferring balance amounts.
 */
public class Transfer {
    private final String fromAccount;
    private final String toAccount;
    private final double amount;
    private final Date timestamp;

    public Transfer(String from, String to, double amount) {
        this.fromAccount = from;
        this.toAccount = to;
        this.amount = amount;
        this.timestamp = new Date();
    }

    public String getFromAccount() {
        return fromAccount;
    }

    public String getToAccount() {
        return toAccount;
    }

    public double getAmount() {
        return amount;
    }

    public Date getTimestamp() {
        return timestamp;
    }
}