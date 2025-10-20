import type {
  Account,
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
  SuccessResponse,
} from "~/types/api";

const API_BASE_URL = "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    public error: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "UNKNOWN_ERROR",
      message: "An unexpected error occurred",
    }));
    throw new ApiError(response.status, error.error, error.message);
  }

  return response.json();
}

export const accountApi = {
  async createAccount(): Promise<Account> {
    return fetchApi<Account>("/accounts", {
      method: "POST",
    });
  },

  async getAllAccounts(): Promise<Account[]> {
    return fetchApi<Account[]>("/accounts");
  },

  async getAccountById(id: string): Promise<Account> {
    return fetchApi<Account>(`/accounts/${id}`);
  },
};

export const moneyApi = {
  async deposit(request: DepositRequest): Promise<SuccessResponse> {
    return fetchApi<SuccessResponse>("/money/deposit", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  async withdraw(request: WithdrawRequest): Promise<SuccessResponse> {
    return fetchApi<SuccessResponse>("/money/withdraw", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  async transfer(request: TransferRequest): Promise<SuccessResponse> {
    return fetchApi<SuccessResponse>("/money/transfer", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

