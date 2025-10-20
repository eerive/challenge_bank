import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { accountApi, ApiError } from "~/lib/api";
import type { Account } from "~/types/api";
import { formatCurrency } from "~/lib/utils";

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (toAccountId: string, amount: number) => Promise<void>;
  processing: boolean;
  currentAccountId: string;
  error?: string | null;
}

export function TransferDialog({
  open,
  onOpenChange,
  onSubmit,
  processing,
  currentAccountId,
  error,
}: TransferDialogProps) {
  const [amount, setAmount] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchAccounts();
    }
  }, [open]);

  const fetchAccounts = async () => {
    try {
      setLoadingAccounts(true);
      setValidationError(null);
      const data = await accountApi.getAllAccounts();
      // Filter out the current account
      setAccounts(data.filter((acc) => acc.accountId !== currentAccountId));
    } catch (err) {
      if (err instanceof ApiError) {
        setValidationError(`Error loading accounts: ${err.message}`);
      }
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setAmountError(null);

    let hasError = false;

    if (!toAccountId.trim()) {
      setAccountError("Please select a destination account");
      hasError = true;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setAmountError("Please enter a valid amount greater than 0");
      hasError = true;
    }

    if (hasError) return;

    await onSubmit(toAccountId.trim(), amountNum);
    setAmount("");
    setToAccountId("");
  };


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (amountError) {
      setAmountError(null);
    }
  };

  const handleAccountChange = (value: string) => {
    setToAccountId(value);
    if (accountError) {
      setAccountError(null);
    }
  };

  const onClose = () => {
    setAmount("");
    setToAccountId("");
    setValidationError(null);
    setAccountError(null);
    setAmountError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogDescription>
            Transfer funds to another account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || validationError) && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600">
                {error || validationError}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="to-account">To Account</Label>
            {loadingAccounts ? (
              <div className="text-sm text-muted-foreground">
                Loading accounts...
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No other accounts available
              </div>
            ) : (
              <>
                <Select
                  value={toAccountId}
                  onValueChange={handleAccountChange}
                  disabled={processing}
                >
                  <SelectTrigger
                    id="to-account"
                    className={accountError ? "border-red-500 focus:ring-red-500" : ""}
                  >
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem
                        key={account.accountId}
                        value={account.accountId}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono text-sm">
                            {account.accountId}
                          </span>
                          <span className="ml-4 text-muted-foreground">
                            {formatCurrency(account.balance)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {accountError && (
                  <p className="text-sm text-red-500">
                    {accountError}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="transfer-amount">Amount</Label>
            <Input
              id="transfer-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              disabled={processing}
              className={amountError ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {amountError && (
              <p className="text-sm text-red-500">
                {amountError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={processing || accounts.length === 0}
            >
              {processing ? "Processing..." : "Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

