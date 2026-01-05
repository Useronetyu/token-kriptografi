import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ArrowRightLeft, Lock, Flame, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useSound } from '@/hooks/useSound';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const OperationsCenter = () => {
  const { 
    tokenBalance, 
    solBalance, 
    stakedBalance,
    mintTokens, 
    transferTokens, 
    swapSolToToken, 
    stakeTokens,
    unstakeTokens,
    claimRewards,
    burnTokens,
    canClaimReward
  } = useWallet();
  const { playSuccess, playError } = useSound();
  
  const [mintAmount, setMintAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMint = async () => {
    const amount = parseInt(mintAmount);
    if (!amount || amount <= 0) {
      playError();
      toast.error('Invalid amount');
      return;
    }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    mintTokens(amount);
    playSuccess();
    setMintAmount('');
    setIsProcessing(false);
    toast.success('Tokens minted!', { description: `+${amount} ILHAM` });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9945FF', '#14F195', '#FFD700'],
    });
  };

  const handleTransfer = async () => {
    const amount = parseInt(transferAmount);
    if (!amount || amount <= 0) {
      playError();
      toast.error('Invalid amount');
      return;
    }
    if (!transferRecipient) {
      playError();
      toast.error('Please enter a recipient address');
      return;
    }
    if (amount > tokenBalance) {
      playError();
      toast.error('Insufficient balance', { description: `You only have ${tokenBalance} ILHAM` });
      return;
    }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    transferTokens(transferRecipient, amount);
    playSuccess();
    setTransferAmount('');
    setTransferRecipient('');
    setIsProcessing(false);
    toast.success('Transfer successful!', { description: `-${amount} ILHAM` });
  };

  const handleSwap = async () => {
    const amount = parseFloat(swapAmount);
    if (!amount || amount <= 0) {
      playError();
      toast.error('Invalid amount');
      return;
    }
    if (amount > solBalance) {
      playError();
      toast.error('Insufficient SOL balance');
      return;
    }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    swapSolToToken(amount);
    playSuccess();
    setSwapAmount('');
    setIsProcessing(false);
    toast.success('Swap complete!', { description: `${amount} SOL → ${amount * 100} ILHAM` });
  };

  const handleStake = async () => {
    const amount = parseInt(stakeAmount);
    if (!amount || amount <= 0) {
      playError();
      toast.error('Invalid amount');
      return;
    }
    if (amount > tokenBalance) {
      playError();
      toast.error('Insufficient token balance');
      return;
    }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    stakeTokens(amount);
    playSuccess();
    setStakeAmount('');
    setIsProcessing(false);
    toast.success('Tokens staked!', { description: `${amount} ILHAM locked` });
  };

  const handleUnstake = async () => {
    const amount = parseInt(unstakeAmount);
    if (!amount || amount <= 0) {
      playError();
      toast.error('Invalid amount');
      return;
    }
    if (amount > stakedBalance) {
      playError();
      toast.error('Insufficient staked balance');
      return;
    }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    unstakeTokens(amount);
    playSuccess();
    setUnstakeAmount('');
    setIsProcessing(false);
    toast.success('Tokens unstaked!', { description: `${amount} ILHAM released` });
  };

  const handleClaimRewards = async () => {
    if (!canClaimReward) {
      playError();
      toast.error('Rewards not ready', { description: 'Wait 10 seconds between claims' });
      return;
    }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    claimRewards();
    playSuccess();
    setIsProcessing(false);
    toast.success('Rewards claimed!');
  };

  const handleBurn = async () => {
    const amount = parseInt(burnAmount);
    if (!amount || amount <= 0) {
      playError();
      toast.error('Invalid amount');
      return;
    }
    if (amount > tokenBalance) {
      playError();
      toast.error('Insufficient token balance');
      return;
    }
    setIsBurning(true);
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    burnTokens(amount);
    playSuccess();
    setBurnAmount('');
    setIsProcessing(false);
    setTimeout(() => setIsBurning(false), 500);
    toast.success('Tokens burned!', { description: `🔥 ${amount} ILHAM destroyed forever` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className={`glass-card p-6 h-full ${isBurning ? 'shake-animation' : ''}`}>
        <h3 className="font-semibold text-lg mb-4">Operations Center</h3>
        
        <Tabs defaultValue="mint" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="mint" className="text-xs sm:text-sm">
              <Sparkles className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Mint</span>
            </TabsTrigger>
            <TabsTrigger value="transfer" className="text-xs sm:text-sm">
              <Send className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Send</span>
            </TabsTrigger>
            <TabsTrigger value="swap" className="text-xs sm:text-sm">
              <ArrowRightLeft className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Swap</span>
            </TabsTrigger>
            <TabsTrigger value="stake" className="text-xs sm:text-sm">
              <Lock className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Stake</span>
            </TabsTrigger>
            <TabsTrigger value="burn" className="text-xs sm:text-sm">
              <Flame className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Burn</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="mint" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Mint new ILHAM tokens (Admin)
                </p>
                <Input
                  type="number"
                  placeholder="Amount to mint"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="mb-3"
                />
                <Button 
                  onClick={handleMint} 
                  className="w-full solana-gradient text-primary-foreground"
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Mint Tokens
                </Button>
              </motion.div>
            </TabsContent>

            <TabsContent value="transfer" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Send ILHAM to another wallet
                </p>
                <Input
                  placeholder="Recipient address"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="mb-3"
                />
                <Input
                  type="number"
                  placeholder="Amount to send"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="mb-3"
                />
                <p className="text-xs text-muted-foreground mb-3">
                  Available: {tokenBalance} ILHAM
                </p>
                <Button 
                  onClick={handleTransfer} 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Send Tokens
                </Button>
              </motion.div>
            </TabsContent>

            <TabsContent value="swap" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Swap SOL for ILHAM (Rate: 1 SOL = 100 ILHAM)
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="SOL amount"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      step="0.1"
                    />
                    <span className="text-muted-foreground">→</span>
                    <div className="flex-1 p-2 bg-secondary rounded-md text-center font-mono">
                      {swapAmount ? parseFloat(swapAmount) * 100 : 0} ILHAM
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available: {solBalance.toFixed(2)} SOL
                  </p>
                  <Button 
                    onClick={handleSwap} 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRightLeft className="mr-2 h-4 w-4" />}
                    Swap
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="stake" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Stake tokens to earn rewards (1% every 10 seconds)
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3 p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="font-mono font-semibold">{tokenBalance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Staked</p>
                    <p className="font-mono font-semibold text-accent">{stakedBalance}</p>
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="Amount to stake"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="mb-2"
                />
                <Button 
                  onClick={handleStake} 
                  className="w-full mb-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                  Stake
                </Button>
                
                <div className="border-t border-border pt-3 mt-3 space-y-2">
                  <Input
                    type="number"
                    placeholder="Amount to unstake"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline"
                      onClick={handleUnstake}
                      disabled={isProcessing || stakedBalance === 0}
                    >
                      Unstake
                    </Button>
                    <Button 
                      variant={canClaimReward ? 'default' : 'outline'}
                      onClick={handleClaimRewards}
                      disabled={isProcessing || !canClaimReward || stakedBalance === 0}
                      className={canClaimReward ? 'neon-glow-green bg-accent text-accent-foreground hover:bg-accent/90' : ''}
                    >
                      Claim Rewards
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="burn" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Permanently destroy tokens to reduce supply
                </p>
                <Input
                  type="number"
                  placeholder="Amount to burn"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  className="mb-3"
                />
                <p className="text-xs text-muted-foreground mb-3">
                  Available: {tokenBalance} ILHAM
                </p>
                <Button 
                  onClick={handleBurn} 
                  variant="destructive"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flame className="mr-2 h-4 w-4" />}
                  🔥 Burn Tokens
                </Button>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </Card>
    </motion.div>
  );
};
