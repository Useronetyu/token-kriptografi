import { motion } from 'framer-motion';
import { Coins, Droplets, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useSound } from '@/hooks/useSound';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const AssetCards = () => {
  const { solBalance, tokenBalance, stakedBalance, airdropSol } = useWallet();
  const { playSuccess } = useSound();

  const handleAirdrop = () => {
    airdropSol();
    playSuccess();
    toast.success('Airdrop received!', {
      description: '+1 SOL has been added to your wallet',
    });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#9945FF', '#14F195'],
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* SOL Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card p-6 overflow-hidden relative group h-full">
          <div className="absolute inset-0 solana-gradient opacity-5 group-hover:opacity-10 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-solana-purple to-solana-green flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">◎</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Solana</p>
                  <p className="font-bold text-lg">SOL</p>
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
              <AnimatedNumber 
                value={solBalance} 
                className="text-3xl font-bold font-mono" 
                suffix=" SOL"
              />
            </div>
            
            <Button
              onClick={handleAirdrop}
              className="w-full solana-gradient text-primary-foreground font-semibold"
            >
              <Droplets className="mr-2 h-4 w-4" />
              Airdrop 1 SOL
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* ILHAM Token Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card p-6 overflow-hidden relative group h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <Coins className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Token</p>
                  <p className="font-bold text-lg">ILHAM</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
              <AnimatedNumber 
                value={tokenBalance} 
                decimals={0}
                className="text-3xl font-bold font-mono" 
              />
            </div>
            
            {stakedBalance > 0 && (
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Staked</p>
                  <AnimatedNumber 
                    value={stakedBalance} 
                    decimals={0}
                    className="text-lg font-semibold font-mono text-accent" 
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
