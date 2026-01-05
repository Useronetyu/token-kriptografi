import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'mint' | 'transfer' | 'swap' | 'stake' | 'unstake' | 'burn' | 'airdrop' | 'reward';
  amount: number;
  date: Date;
  status: 'success' | 'pending' | 'failed';
  details?: string;
}

interface WalletContextType {
  walletAddress: string | null;
  solBalance: number;
  tokenBalance: number;
  stakedBalance: number;
  transactions: Transaction[];
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  airdropSol: () => void;
  mintTokens: (amount: number) => void;
  transferTokens: (recipient: string, amount: number) => boolean;
  swapSolToToken: (solAmount: number) => boolean;
  stakeTokens: (amount: number) => boolean;
  unstakeTokens: (amount: number) => boolean;
  claimRewards: () => void;
  burnTokens: (amount: number) => boolean;
  lastRewardClaim: Date | null;
  canClaimReward: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const generateWalletAddress = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateTxId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastRewardClaim, setLastRewardClaim] = useState<Date | null>(null);
  const [canClaimReward, setCanClaimReward] = useState(false);

  useEffect(() => {
    if (stakedBalance > 0 && lastRewardClaim) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - lastRewardClaim.getTime();
        setCanClaimReward(diff >= 10000);
      }, 1000);
      return () => clearInterval(interval);
    } else if (stakedBalance > 0 && !lastRewardClaim) {
      setCanClaimReward(true);
    } else {
      setCanClaimReward(false);
    }
  }, [stakedBalance, lastRewardClaim]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...tx,
      id: generateTxId(),
      date: new Date(),
    };
    setTransactions(prev => [newTx, ...prev]);
  }, []);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setWalletAddress(generateWalletAddress());
    setIsConnecting(false);
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setSolBalance(0);
    setTokenBalance(0);
    setStakedBalance(0);
    setTransactions([]);
    setLastRewardClaim(null);
  }, []);

  const airdropSol = useCallback(() => {
    setSolBalance(prev => prev + 1);
    addTransaction({ type: 'airdrop', amount: 1, status: 'success', details: 'SOL Airdrop' });
  }, [addTransaction]);

  const mintTokens = useCallback((amount: number) => {
    setTokenBalance(prev => prev + amount);
    addTransaction({ type: 'mint', amount, status: 'success', details: `Minted ${amount} ILHAM` });
  }, [addTransaction]);

  const transferTokens = useCallback((recipient: string, amount: number): boolean => {
    if (amount > tokenBalance) return false;
    setTokenBalance(prev => prev - amount);
    addTransaction({ type: 'transfer', amount, status: 'success', details: `Sent to ${recipient.slice(0, 8)}...` });
    return true;
  }, [tokenBalance, addTransaction]);

  const swapSolToToken = useCallback((solAmount: number): boolean => {
    if (solAmount > solBalance) return false;
    const tokenAmount = solAmount * 100;
    setSolBalance(prev => prev - solAmount);
    setTokenBalance(prev => prev + tokenAmount);
    addTransaction({ type: 'swap', amount: tokenAmount, status: 'success', details: `Swapped ${solAmount} SOL → ${tokenAmount} ILHAM` });
    return true;
  }, [solBalance, addTransaction]);

  const stakeTokens = useCallback((amount: number): boolean => {
    if (amount > tokenBalance) return false;
    setTokenBalance(prev => prev - amount);
    setStakedBalance(prev => prev + amount);
    addTransaction({ type: 'stake', amount, status: 'success', details: `Staked ${amount} ILHAM` });
    if (!lastRewardClaim) setLastRewardClaim(new Date());
    return true;
  }, [tokenBalance, lastRewardClaim, addTransaction]);

  const unstakeTokens = useCallback((amount: number): boolean => {
    if (amount > stakedBalance) return false;
    setStakedBalance(prev => prev - amount);
    setTokenBalance(prev => prev + amount);
    addTransaction({ type: 'unstake', amount, status: 'success', details: `Unstaked ${amount} ILHAM` });
    return true;
  }, [stakedBalance, addTransaction]);

  const claimRewards = useCallback(() => {
    if (!canClaimReward || stakedBalance === 0) return;
    const reward = Math.floor(stakedBalance * 0.01);
    if (reward > 0) {
      setTokenBalance(prev => prev + reward);
      addTransaction({ type: 'reward', amount: reward, status: 'success', details: `Claimed staking reward` });
    }
    setLastRewardClaim(new Date());
    setCanClaimReward(false);
  }, [canClaimReward, stakedBalance, addTransaction]);

  const burnTokens = useCallback((amount: number): boolean => {
    if (amount > tokenBalance) return false;
    setTokenBalance(prev => prev - amount);
    addTransaction({ type: 'burn', amount, status: 'success', details: `Burned ${amount} ILHAM` });
    return true;
  }, [tokenBalance, addTransaction]);

  return (
    <WalletContext.Provider value={{
      walletAddress,
      solBalance,
      tokenBalance,
      stakedBalance,
      transactions,
      isConnecting,
      connectWallet,
      disconnectWallet,
      airdropSol,
      mintTokens,
      transferTokens,
      swapSolToToken,
      stakeTokens,
      unstakeTokens,
      claimRewards,
      burnTokens,
      lastRewardClaim,
      canClaimReward,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
