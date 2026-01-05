import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Sparkles, Send, ArrowRightLeft, Lock, Unlock, Flame, Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useWallet, Transaction } from '@/contexts/WalletContext';
import { formatDistanceToNow } from 'date-fns';

const getTransactionIcon = (type: Transaction['type']) => {
  const icons = {
    mint: Sparkles,
    transfer: Send,
    swap: ArrowRightLeft,
    stake: Lock,
    unstake: Unlock,
    burn: Flame,
    airdrop: Gift,
    reward: TrendingUp,
  };
  return icons[type] || Activity;
};

const getTransactionColor = (type: Transaction['type']) => {
  const colors: Record<Transaction['type'], string> = {
    mint: 'text-primary',
    transfer: 'text-orange-500',
    swap: 'text-blue-500',
    stake: 'text-purple-500',
    unstake: 'text-purple-400',
    burn: 'text-destructive',
    airdrop: 'text-accent',
    reward: 'text-accent',
  };
  return colors[type];
};

const isInflowType = (type: Transaction['type']) => {
  return ['mint', 'swap', 'unstake', 'airdrop', 'reward'].includes(type);
};

export const TransactionHistory = () => {
  const { transactions } = useWallet();

  const totalTxCount = transactions.length;
  const totalVolumeIn = transactions
    .filter(tx => isInflowType(tx.type))
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalVolumeOut = transactions
    .filter(tx => !isInflowType(tx.type))
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-6"
    >
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Transaction Analytics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold font-mono">{totalTxCount}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Volume In</p>
              <p className="text-2xl font-bold font-mono text-accent">+{totalVolumeIn.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <ArrowDownRight className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Volume Out</p>
              <p className="text-2xl font-bold font-mono text-destructive">-{totalVolumeOut.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Details</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No transactions yet. Start by airdropping some SOL!
                  </TableCell>
                </TableRow>
              ) : (
                transactions.slice(0, 10).map((tx, index) => {
                  const Icon = getTransactionIcon(tx.type);
                  const colorClass = getTransactionColor(tx.type);
                  const isInflow = isInflowType(tx.type);
                  
                  return (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-lg bg-secondary flex items-center justify-center ${colorClass}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="capitalize font-medium hidden sm:inline">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-mono font-semibold ${isInflow ? 'text-accent' : 'text-destructive'}`}>
                          {isInflow ? '+' : '-'}{tx.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {tx.details}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDistanceToNow(tx.date, { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  );
};
