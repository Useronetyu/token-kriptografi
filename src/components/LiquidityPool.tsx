import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import { useSound } from '@/hooks/useSound';
import { toast } from 'sonner';
import { AnimatedNumber } from '@/components/AnimatedNumber';

export const LiquidityPool = () => {
  const { solBalance, tokenBalance } = useWallet();
  const { playSuccess, playError } = useSound();
  
  const [lpSolAmount, setLpSolAmount] = useState('');
  const [lpTokenAmount, setLpTokenAmount] = useState('');
  const [lpShares, setLpShares] = useState(0);
  const [feesEarned, setFeesEarned] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate fees earning based on LP shares
  useEffect(() => {
    if (lpShares > 0) {
      const interval = setInterval(() => {
        const simulatedVolume = Math.random() * 100;
        const feeRate = 0.003; // 0.3% fee
        const userShare = lpShares / (lpShares + 10000); // Simulated total pool
        const newFees = simulatedVolume * feeRate * userShare;
        setFeesEarned(prev => prev + newFees);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [lpShares]);

  const handleProvideLiquidity = async () => {
    const solAmount = parseFloat(lpSolAmount);
    const tokenAmount = parseFloat(lpTokenAmount);

    if (!solAmount || !tokenAmount || solAmount <= 0 || tokenAmount <= 0) {
      playError();
      toast.error('Enter valid amounts for both tokens');
      return;
    }

    if (solAmount > solBalance) {
      playError();
      toast.error('Insufficient SOL balance');
      return;
    }

    if (tokenAmount > tokenBalance) {
      playError();
      toast.error('Insufficient ILHAM balance');
      return;
    }

    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));
    
    // Calculate LP shares (simplified: geometric mean)
    const shares = Math.sqrt(solAmount * tokenAmount) * 100;
    setLpShares(prev => prev + shares);
    
    playSuccess();
    setLpSolAmount('');
    setLpTokenAmount('');
    setIsProcessing(false);
    toast.success('Liquidity provided!', { 
      description: `Received ${shares.toFixed(2)} LP tokens` 
    });
  };

  const handleWithdrawLiquidity = async () => {
    if (lpShares <= 0) {
      playError();
      toast.error('No liquidity to withdraw');
      return;
    }

    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));
    
    const withdrawnShares = lpShares;
    setLpShares(0);
    setFeesEarned(0);
    
    playSuccess();
    setIsProcessing(false);
    toast.success('Liquidity withdrawn!', { 
      description: `Redeemed ${withdrawnShares.toFixed(2)} LP tokens + ${feesEarned.toFixed(4)} fees` 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Liquidity Pool</h3>
          <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full ml-auto">
            SOL/ILHAM
          </span>
        </div>

        {lpShares > 0 && (
          <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-primary/10 border border-blue-500/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Your LP Shares</p>
                <p className="font-mono font-bold text-lg">{lpShares.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  Fees Earned
                </p>
                <AnimatedNumber 
                  value={feesEarned} 
                  className="font-mono font-bold text-lg text-accent"
                  suffix=" ILHAM"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">SOL Amount</label>
            <Input
              type="number"
              placeholder="0.00"
              value={lpSolAmount}
              onChange={(e) => setLpSolAmount(e.target.value)}
              step="0.1"
            />
            <p className="text-xs text-muted-foreground mt-1">Available: {solBalance.toFixed(2)} SOL</p>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">ILHAM Amount</label>
            <Input
              type="number"
              placeholder="0"
              value={lpTokenAmount}
              onChange={(e) => setLpTokenAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">Available: {tokenBalance.toLocaleString()} ILHAM</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              onClick={handleProvideLiquidity}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Droplets className="mr-2 h-4 w-4" />
              )}
              Add Liquidity
            </Button>
            <Button
              variant="outline"
              onClick={handleWithdrawLiquidity}
              disabled={isProcessing || lpShares <= 0}
            >
              Withdraw All
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
