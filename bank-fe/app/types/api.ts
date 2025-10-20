export interface Transfer {
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string;
}

export interface Account {
  accountId: string;
  balance: number;
  recentTransfers: Transfer[];
}

export interface DepositRequest {
  accountId: string;
  amount: number;
}

export interface WithdrawRequest {
  accountId: string;
  amount: number;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface SuccessResponse {
  message: string;
}

