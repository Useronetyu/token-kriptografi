import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

type TimeRange = '1D' | '1W' | '1M' | '1Y' | 'ALL';

const generateMockData = (range: TimeRange) => {
  const points: { time: string; price: number }[] = [];
  let numPoints: number;
  let basePrice = 0.05;
  
  switch (range) {
    case '1D': numPoints = 24; break;
    case '1W': numPoints = 7; break;
    case '1M': numPoints = 30; break;
    case '1Y': numPoints = 12; break;
    case 'ALL': numPoints = 24; break;
    default: numPoints = 24;
  }

  for (let i = 0; i < numPoints; i++) {
    const volatility = 0.02;
    const change = (Math.random() - 0.45) * volatility;
    basePrice = Math.max(0.01, basePrice + change);
    
    let label: string;
    switch (range) {
      case '1D': label = `${i}:00`; break;
      case '1W': label = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i % 7]; break;
      case '1M': label = `Day ${i + 1}`; break;
      case '1Y': label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]; break;
      case 'ALL': label = `Q${Math.floor(i / 6) + 1}`; break;
      default: label = `${i}`;
    }
    
    points.push({ time: label, price: parseFloat(basePrice.toFixed(4)) });
  }
  
  return points;
};

export const PriceChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1W');
  const [dataKey, setDataKey] = useState(0);
  
  const data = useMemo(() => generateMockData(timeRange), [timeRange, dataKey]);
  
  const trend = data[data.length - 1]?.price > data[0]?.price;
  const priceChange = data.length > 1 
    ? ((data[data.length - 1].price - data[0].price) / data[0].price * 100).toFixed(2)
    : '0.00';

  const handleRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setDataKey(prev => prev + 1);
  };

  const chartColor = trend ? 'hsl(158, 100%, 52%)' : 'hsl(0, 84%, 60%)';
  const chartFill = trend ? 'url(#greenGradient)' : 'url(#redGradient)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-card p-6 h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">ILHAM Price</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono">
                ${data[data.length - 1]?.price.toFixed(4)}
              </span>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                trend ? 'text-accent' : 'text-destructive'
              }`}>
                {trend ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {trend ? '+' : ''}{priceChange}%
              </span>
            </div>
          </div>
          <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
            {(['1D', '1W', '1M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleRangeChange(range)}
                className={`px-3 ${
                  timeRange === range 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-secondary'
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(158, 100%, 52%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(158, 100%, 52%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill={chartFill}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};
