import { motion } from 'framer-motion';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useWallet } from '@/contexts/WalletContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const TokenPortfolio = () => {
  const { tokenBalance, stakedBalance, transactions } = useWallet();

  const burnedAmount = transactions
    .filter(tx => tx.type === 'burn')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const data = [
    { name: 'Available', value: tokenBalance, color: 'hsl(var(--primary))' },
    { name: 'Staked', value: stakedBalance, color: 'hsl(var(--accent))' },
    { name: 'Burned', value: burnedAmount, color: 'hsl(var(--destructive))' },
  ].filter(item => item.value > 0);

  const total = tokenBalance + stakedBalance + burnedAmount;

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Token Portfolio</h3>
          </div>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            No tokens yet. Mint or swap to get started!
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Token Portfolio</h3>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} ILHAM (${((value / total) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-foreground text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="text-center p-2 rounded-lg bg-primary/10">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="font-mono font-semibold text-primary">{tokenBalance.toLocaleString()}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-accent/10">
            <p className="text-xs text-muted-foreground">Staked</p>
            <p className="font-mono font-semibold text-accent">{stakedBalance.toLocaleString()}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-destructive/10">
            <p className="text-xs text-muted-foreground">Burned</p>
            <p className="font-mono font-semibold text-destructive">{burnedAmount.toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
