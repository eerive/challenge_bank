package de.revel8.challenge.bank.controller;

import de.revel8.challenge.bank.dto.DepositRequestDto;
import de.revel8.challenge.bank.dto.ErrorResponseDto;
import de.revel8.challenge.bank.dto.TransferRequestDto;
import de.revel8.challenge.bank.dto.WithdrawRequestDto;
import de.revel8.challenge.bank.service.MoneyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/money")
public class MoneyController {

    private final MoneyService moneyService;

    public MoneyController(MoneyService moneyService) {
        this.moneyService = moneyService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody DepositRequestDto request) {
        try {
            moneyService.deposit(request.accountId(), request.amount());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Deposit successful");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponseDto("BAD_REQUEST", e.getMessage()));
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody WithdrawRequestDto request) {
        try {
            moneyService.withdraw(request.accountId(), request.amount());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Withdrawal successful");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponseDto("BAD_REQUEST", e.getMessage()));
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequestDto request) {
        try {
            moneyService.transfer(
                    request.fromAccountId(),
                    request.toAccountId(),
                    request.amount());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Transfer successful");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            HttpStatus status = e.getMessage().contains("not found")
                    ? HttpStatus.NOT_FOUND
                    : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status)
                    .body(new ErrorResponseDto(status.name(), e.getMessage()));
        }
    }
}
