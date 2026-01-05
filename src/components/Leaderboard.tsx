import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useWallet } from '@/contexts/WalletContext';

const fakeWhales = [
  { name: 'CryptoKing', balance: 12500000, avatar: 'CK' },
  { name: 'SolanaWhale', balance: 8750000, avatar: 'SW' },
  { name: 'TokenMaster', balance: 5200000, avatar: 'TM' },
  { name: 'DeFiLord', balance: 3100000, avatar: 'DL' },
  { name: 'BlockBaron', balance: 1850000, avatar: 'BB' },
];

export interface Holder {
  name: string;
  balance: number;
  avatar: string;
  isUser?: boolean;
}

interface LeaderboardProps {
  onSelectHolder?: (holder: Holder) => void;
  selectedHolder?: Holder | null;
}

export const Leaderboard = ({ onSelectHolder, selectedHolder }: LeaderboardProps) => {
  const { tokenBalance, walletAddress } = useWallet();

  const allPlayers: Holder[] = [
    ...fakeWhales,
    ...(walletAddress ? [{ name: 'You', balance: tokenBalance, avatar: 'ME', isUser: true }] : []),
  ].sort((a, b) => b.balance - a.balance);

  const topPlayers = allPlayers.slice(0, 5);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 1: return <Medal className="h-4 w-4 text-gray-400" />;
      case 2: return <Medal className="h-4 w-4 text-amber-600" />;
      default: return <Star className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatBalance = (balance: number) => {
    if (balance >= 1000000) return `${(balance / 1000000).toFixed(2)}M`;
    if (balance >= 1000) return `${(balance / 1000).toFixed(2)}K`;
    return balance.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="h-full"
    >
      <Card className="glass-card p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold">Top Holders</h3>
          {onSelectHolder && (
            <span className="text-xs text-muted-foreground ml-auto">
              Click to view activity
            </span>
          )}
        </div>
        <div className="space-y-3">
          {topPlayers.map((player, index) => {
            const isSelected = selectedHolder?.name === player.name;
            
            return (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                onClick={() => onSelectHolder?.(player)}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  onSelectHolder ? 'cursor-pointer' : ''
                } ${
                  isSelected
                    ? 'bg-primary/20 border-2 border-primary shadow-lg'
                    : player.isUser
                    ? 'bg-primary/10 border border-primary/30 hover:bg-primary/15'
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6">
                    {getRankIcon(index)}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-xs font-semibold ${
                      player.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}>
                      {player.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`text-sm font-medium ${
                    player.isUser ? 'text-primary' : ''
                  }`}>
                    {player.name}
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold">
                  {formatBalance(player.balance)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};
