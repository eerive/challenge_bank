import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Route } from "./+types/account.$id";
import { accountApi, moneyApi, ApiError } from "~/lib/api";
import type { Account } from "~/types/api";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { BalanceCard } from "~/components/account/BalanceCard";
import { TransactionHistory } from "~/components/account/TransactionHistory";
import { DepositDialog } from "~/components/account/DepositDialog";
import { WithdrawDialog } from "~/components/account/WithdrawDialog";
import { TransferDialog } from "~/components/account/TransferDialog";
import { AlertTriangle, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Account Details" },
    { name: "description", content: "View account details and manage transactions" },
  ];
}

// Defines the possible modal dialog states
type ModalType = "deposit" | "withdraw" | "transfer" | null;

export default function AccountDetails() {
  const { id } = useParams();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<ModalType>(null);
  const [processing, setProcessing] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchAccount = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await accountApi.getAccountById(id);
      setAccount(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch account");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [id]);

  const handleError = (err: unknown, operationType: "deposit" | "withdraw" | "transfer") => {
    let errorTitle: string;
    
    switch (operationType) {
      case "deposit":
        errorTitle = "Deposit failed";
        break;
      case "withdraw":
        errorTitle = "Withdrawal failed";
        break;
      case "transfer":
        errorTitle = "Transfer failed";
        break;
    }

    const errorMessage = err instanceof ApiError ? err.message : "An unexpected error occurred";
    
    setModalError(errorMessage);
    toast.error(errorTitle, {
      description: errorMessage,
    });
  };

  const handleDeposit = async (amount: number) => {
    if (!account) return;

    try {
      setProcessing(true);
      setModalError(null);

      await moneyApi.deposit({ accountId: account.accountId, amount });
      await fetchAccount();

      setModalOpen(null);
      toast.success("Deposit successful", {
        description: `€${amount.toFixed(2)} has been deposited to your account`,
      });
    } catch (err) {
      handleError(err, "deposit");
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async (amount: number) => {
    if (!account) return;

    try {
      setProcessing(true);
      setModalError(null);

      await moneyApi.withdraw({ accountId: account.accountId, amount });
      await fetchAccount();

      setModalOpen(null);
      toast.success("Withdrawal successful", {
        description: `€${amount.toFixed(2)} has been withdrawn from your account`,
      });
    } catch (err) {
      handleError(err, "withdraw");
    } finally {
      setProcessing(false);
    }
  };

  const handleTransfer = async (toAccountId: string, amount: number) => {
    if (!account) return;

    try {
      setProcessing(true);
      setModalError(null);

      await moneyApi.transfer({
        fromAccountId: account.accountId,
        toAccountId,
        amount,
      });
      await fetchAccount();
      
      setModalOpen(null);
      toast.success("Transfer successful", {
        description: `€${amount.toFixed(2)} has been transferred to ${toAccountId}`,
      });
    } catch (err) {
      handleError(err, "transfer");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {error || "Account not found"}
              </h3>
              <div className="mt-6">
                <Link to="/">
                  <Button variant="secondary">Back to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Account Details
              </h1>
              <p className="mt-1 text-sm text-gray-600 font-mono">
                {account.accountId}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <BalanceCard
            balance={account.balance}
            onDeposit={() => setModalOpen("deposit")}
            onWithdraw={() => setModalOpen("withdraw")}
            onTransfer={() => setModalOpen("transfer")}
          />
          <TransactionHistory
            transfers={account.recentTransfers}
            currentAccountId={account.accountId}
          />
        </div>
      </main>

      <DepositDialog
        open={modalOpen === "deposit"}
        onOpenChange={(open) => {
          if (!open) {
            setModalOpen(null);
            setModalError(null);
          }
        }}
        onSubmit={handleDeposit}
        processing={processing}
        error={modalError}
      />

      <WithdrawDialog
        open={modalOpen === "withdraw"}
        onOpenChange={(open) => {
          if (!open) {
            setModalOpen(null);
            setModalError(null);
          }
        }}
        onSubmit={handleWithdraw}
        processing={processing}
        error={modalError}
      />

      <TransferDialog
        open={modalOpen === "transfer"}
        onOpenChange={(open) => {
          if (!open) {
            setModalOpen(null);
            setModalError(null);
          }
        }}
        onSubmit={handleTransfer}
        processing={processing}
        currentAccountId={account.accountId}
        error={modalError}
      />
    </div>
  );
}
