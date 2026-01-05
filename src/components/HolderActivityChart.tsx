import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HolderActivityChartProps {
  selectedHolder: {
    name: string;
    balance: number;
    avatar: string;
    isUser?: boolean;
  } | null;
}

const generateHolderActivity = (holderName: string) => {
  const activities = [];
  const types = ['Mint', 'Stake', 'Swap', 'Transfer', 'Unstake', 'Burn'];
  
  for (let i = 0; i < 7; i++) {
    activities.push({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      volume: Math.floor(Math.random() * 100000 + 10000),
      type: types[Math.floor(Math.random() * types.length)],
    });
  }
  return activities;
};

export const HolderActivityChart = ({ selectedHolder }: HolderActivityChartProps) => {
  const activityData = useMemo(() => {
    if (!selectedHolder) return [];
    return generateHolderActivity(selectedHolder.name);
  }, [selectedHolder]);

  if (!selectedHolder) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="glass-card p-6 h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a holder to view their activity</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{selectedHolder.name}'s Activity</h3>
          {selectedHolder.isUser && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
        
        <div className="mb-4 p-3 rounded-lg bg-secondary/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Balance</p>
              <p className="font-mono font-bold text-lg">
                {selectedHolder.balance >= 1000000 
                  ? `${(selectedHolder.balance / 1000000).toFixed(2)}M` 
                  : selectedHolder.balance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Weekly Txs</p>
              <p className="font-mono font-bold text-lg">{activityData.length}</p>
            </div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value.toLocaleString()} ILHAM`, 'Volume']}
              />
              <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                {activityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`hsl(var(--primary) / ${0.4 + (index * 0.1)})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};
