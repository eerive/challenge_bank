import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/lib/utils";

interface BalanceCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

export function BalanceCard({
  balance,
  onDeposit,
  onWithdraw,
  onTransfer,
}: BalanceCardProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">
          Current Balance
        </h2>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-6">
          {formatCurrency(balance)}
        </div>
        <div className="space-y-2">
          <Button className="w-full" onClick={onDeposit}>
            Deposit
          </Button>
          <Button className="w-full" variant="secondary" onClick={onWithdraw}>
            Withdraw
          </Button>
          <Button className="w-full" variant="secondary" onClick={onTransfer}>
            Transfer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

