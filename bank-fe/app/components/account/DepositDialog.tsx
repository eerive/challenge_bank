import { useState } from "react";
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

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (amount: number) => Promise<void>;
  processing: boolean;
  error?: string | null;
}

export function DepositDialog({
  open,
  onOpenChange,
  onSubmit,
  processing,
  error,
}: DepositDialogProps) {
  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setValidationError("Please enter a valid amount greater than 0");
      return;
    }
    await onSubmit(amountNum);
    setAmount("");
  };

  const handleClose = () => {
    setAmount("");
    setValidationError(null);
    onOpenChange(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  const errorMessage = error || validationError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Money</DialogTitle>
          <DialogDescription>Add funds to your account</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deposit-amount">Amount</Label>
            <Input
              id="deposit-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              disabled={processing}
              className={errorMessage ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">
                {errorMessage}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? "Processing..." : "Deposit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

