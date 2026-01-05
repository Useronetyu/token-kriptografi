import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellRing, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSound } from '@/hooks/useSound';
import { toast } from 'sonner';

interface PriceAlert {
  id: string;
  targetPrice: number;
  direction: 'above' | 'below';
  triggered: boolean;
}

export const PriceAlerts = () => {
  const { playSuccess } = useSound();
  const [currentPrice, setCurrentPrice] = useState(0.05);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlertPrice, setNewAlertPrice] = useState('');
  const [alertDirection, setAlertDirection] = useState<'above' | 'below'>('above');

  // Simulate price movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 0.005;
        return Math.max(0.01, prev + change);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check alerts
  const checkAlerts = useCallback(() => {
    setAlerts(prev => 
      prev.map(alert => {
        if (alert.triggered) return alert;
        
        const shouldTrigger = 
          (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
          (alert.direction === 'below' && currentPrice <= alert.targetPrice);
        
        if (shouldTrigger) {
          playSuccess();
          toast.success('Price Alert Triggered!', {
            description: `ILHAM is now ${alert.direction} $${alert.targetPrice.toFixed(4)}`,
            icon: <BellRing className="h-4 w-4 text-primary" />,
          });
          return { ...alert, triggered: true };
        }
        return alert;
      })
    );
  }, [currentPrice, playSuccess]);

  useEffect(() => {
    checkAlerts();
  }, [checkAlerts]);

  const addAlert = () => {
    const price = parseFloat(newAlertPrice);
    if (!price || price <= 0) {
      toast.error('Enter a valid price');
      return;
    }

    const newAlert: PriceAlert = {
      id: Math.random().toString(36).substring(7),
      targetPrice: price,
      direction: alertDirection,
      triggered: false,
    };

    setAlerts(prev => [...prev, newAlert]);
    setNewAlertPrice('');
    toast.success('Alert created!', {
      description: `Alert when price goes ${alertDirection} $${price.toFixed(4)}`,
    });
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold">Price Alerts</h3>
          {alerts.filter(a => !a.triggered).length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {alerts.filter(a => !a.triggered).length} active
            </Badge>
          )}
        </div>

        <div className="mb-4 p-3 rounded-lg bg-secondary/50 text-center">
          <p className="text-xs text-muted-foreground mb-1">Current ILHAM Price</p>
          <p className="text-2xl font-bold font-mono">${currentPrice.toFixed(4)}</p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Target price"
              value={newAlertPrice}
              onChange={(e) => setNewAlertPrice(e.target.value)}
              step="0.01"
              className="flex-1"
            />
            <Button
              variant={alertDirection === 'above' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setAlertDirection('above')}
              className={alertDirection === 'above' ? 'bg-accent text-accent-foreground' : ''}
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
            <Button
              variant={alertDirection === 'below' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setAlertDirection('below')}
              className={alertDirection === 'below' ? 'bg-destructive text-destructive-foreground' : ''}
            >
              <TrendingDown className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={addAlert} className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Alert ({alertDirection === 'above' ? 'Above' : 'Below'})
          </Button>
        </div>

        {alerts.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {alerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  alert.triggered 
                    ? 'bg-accent/10 border border-accent/30' 
                    : 'bg-secondary/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {alert.direction === 'above' ? (
                    <TrendingUp className="h-4 w-4 text-accent" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className="font-mono text-sm">
                    ${alert.targetPrice.toFixed(4)}
                  </span>
                  {alert.triggered && (
                    <Badge variant="success" className="text-xs">
                      Triggered
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeAlert(alert.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            No alerts set. Create one above!
          </p>
        )}
      </Card>
    </motion.div>
  );
};
