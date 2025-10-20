import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { accountApi, ApiError } from "~/lib/api";
import type { Account } from "~/types/api";
import { formatCurrency } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { AlertTriangle, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Banking Dashboard" },
    { name: "description", content: "Manage your bank accounts" },
  ];
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountApi.getAllAccounts();
      setAccounts(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch accounts");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleError = (err: unknown, operationType: "create") => {
    let errorTitle: string;
    
    switch (operationType) {
      case "create":
        errorTitle = "Failed to create account";
        break;
    }

    const errorMessage = err instanceof ApiError ? err.message : "An unexpected error occurred";
    
    setErrorDialogMessage(errorMessage);
    setErrorDialogOpen(true);
    toast.error(errorTitle, {
      description: errorMessage,
    });
  };

  const handleCreateAccount = async () => {
    try {
      setCreating(true);
      const newAccount = await accountApi.createAccount();
      
      setAccounts([...accounts, newAccount]);
      toast.success("Account created successfully", {
        description: `Account ${newAccount.accountId} has been created`,
      });
    } catch (err) {
      handleError(err, "create");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Fast & Reckless Bank
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your accounts and transactions
              </p>
            </div>
            <Button
              onClick={handleCreateAccount}
              disabled={creating}
              size="lg"
            >
              {creating ? "Creating..." : "Add new account"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : accounts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No accounts available
              </h3> 
              <div className="mt-6">
                <Button onClick={handleCreateAccount} disabled={creating}>
                  {creating ? "Creating..." : "+ Create Account"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <Card key={account.accountId} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Account
                    </h3>
                  </div>
                  <p className="mt-1 text-sm font-mono">
                    {account.accountId}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Balance
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Recent outgoing transfers
                      </p>
                      <p className="text-sm text-gray-600">
                        {account.recentTransfers.length} transaction(s)
                      </p>
                    </div>
                    <Link to={`/account/${account.accountId}`}>
                      <Button className="w-full" variant="secondary">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Error
            </DialogTitle>
            <DialogDescription>{errorDialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

