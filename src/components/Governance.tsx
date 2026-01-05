import { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { useSound } from '@/hooks/useSound';
import { toast } from 'sonner';

interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  totalVoters: number;
  status: 'active' | 'passed' | 'rejected';
  endsIn: string;
  userVote?: 'for' | 'against';
}

const initialProposals: Proposal[] = [
  {
    id: '1',
    title: 'Burn 10% of Total Supply',
    description: 'Proposal to permanently burn 10% of the circulating ILHAM supply to increase scarcity.',
    votesFor: 850000,
    votesAgainst: 320000,
    totalVoters: 1245,
    status: 'active',
    endsIn: '2 days',
  },
  {
    id: '2',
    title: 'Increase Staking Rewards to 2%',
    description: 'Double the staking reward rate from 1% to 2% per reward cycle.',
    votesFor: 620000,
    votesAgainst: 580000,
    totalVoters: 987,
    status: 'active',
    endsIn: '5 days',
  },
  {
    id: '3',
    title: 'Add New Trading Pair',
    description: 'List ILHAM/USDC trading pair on the simulated DEX.',
    votesFor: 920000,
    votesAgainst: 150000,
    totalVoters: 1543,
    status: 'passed',
    endsIn: 'Ended',
  },
];

export const Governance = () => {
  const { tokenBalance, stakedBalance } = useWallet();
  const { playSuccess, playError } = useSound();
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);

  const votingPower = tokenBalance + stakedBalance;

  const handleVote = (proposalId: string, voteType: 'for' | 'against') => {
    if (votingPower <= 0) {
      playError();
      toast.error('No voting power', {
        description: 'You need ILHAM tokens to vote',
      });
      return;
    }

    setProposals(prev =>
      prev.map(p => {
        if (p.id !== proposalId) return p;
        if (p.userVote) {
          playError();
          toast.error('Already voted on this proposal');
          return p;
        }

        playSuccess();
        toast.success('Vote cast!', {
          description: `You voted ${voteType === 'for' ? 'FOR' : 'AGAINST'} with ${votingPower.toLocaleString()} voting power`,
        });

        return {
          ...p,
          votesFor: voteType === 'for' ? p.votesFor + votingPower : p.votesFor,
          votesAgainst: voteType === 'against' ? p.votesAgainst + votingPower : p.votesAgainst,
          totalVoters: p.totalVoters + 1,
          userVote: voteType,
        };
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold">Governance</h3>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Voting Power:</span>
            <span className="font-mono font-bold text-primary">
              {votingPower.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {proposals.map((proposal, index) => {
            const totalVotes = proposal.votesFor + proposal.votesAgainst;
            const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 50;

            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-secondary/30 border border-border"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-sm">{proposal.title}</h4>
                  <Badge
                    variant={
                      proposal.status === 'passed'
                        ? 'success'
                        : proposal.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className="shrink-0"
                  >
                    {proposal.status === 'active' ? (
                      <Clock className="h-3 w-3 mr-1" />
                    ) : proposal.status === 'passed' ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {proposal.status}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">
                  {proposal.description}
                </p>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-accent">For: {forPercentage.toFixed(1)}%</span>
                    <span className="text-destructive">Against: {(100 - forPercentage).toFixed(1)}%</span>
                  </div>
                  <div className="relative h-2 rounded-full overflow-hidden bg-destructive/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${forPercentage}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="absolute inset-y-0 left-0 bg-accent rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {proposal.totalVoters.toLocaleString()} voters
                    {proposal.status === 'active' && (
                      <span className="ml-2">• {proposal.endsIn} left</span>
                    )}
                  </div>

                  {proposal.status === 'active' && !proposal.userVote && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleVote(proposal.id, 'for')}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        For
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleVote(proposal.id, 'against')}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Against
                      </Button>
                    </div>
                  )}

                  {proposal.userVote && (
                    <Badge variant={proposal.userVote === 'for' ? 'success' : 'destructive'}>
                      Voted {proposal.userVote}
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};
