import { Card, CardHeader, CardContent, CardDescription } from "~/components/ui/card";
import type { Transfer } from "~/types/api";
import { formatCurrency } from "~/lib/utils";
import { ArrowRight, ArrowDown } from "lucide-react";

interface TransactionHistoryProps {
  transfers: Transfer[];
  currentAccountId: string;
}

export function TransactionHistory({
  transfers,
  currentAccountId,
}: TransactionHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">
          Outgoing Transaction History
        </h2>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (

          <p className="mt-2 text-sm text-gray-500">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-4">
            {transfers.map((transfer, index) => {
              const isOutgoing = transfer.fromAccount === currentAccountId;
              const otherAccount = isOutgoing
                ? transfer.toAccount
                : transfer.fromAccount;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isOutgoing
                          ? "bg-red-100"
                          : "bg-green-100"
                        }`}
                    >
                      {isOutgoing ? (
                        <ArrowRight className="w-5 h-5 text-red-600" />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isOutgoing ? "Sent to" : "Received from"}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {otherAccount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(transfer.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-semibold ${isOutgoing
                        ? "text-red-600"
                        : "text-green-600"
                      }`}
                  >
                    {isOutgoing ? "-" : "+"}
                    {formatCurrency(transfer.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

