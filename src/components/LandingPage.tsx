import { motion } from 'framer-motion';
import { Wallet, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';

export const LandingPage = () => {
  const { connectWallet, isConnecting } = useWallet();

  const features = [
    { icon: Sparkles, title: 'Mint Tokens', description: 'Create your own ILHAM tokens instantly' },
    { icon: TrendingUp, title: 'Swap & Trade', description: 'Exchange SOL for tokens at live rates' },
    { icon: Shield, title: 'Stake & Earn', description: 'Earn rewards by staking your tokens' },
    { icon: Zap, title: 'Burn Mechanism', description: 'Reduce supply through token burning' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-8"
        >
          <div className="relative">
            <div className="h-24 w-24 rounded-3xl solana-gradient flex items-center justify-center mx-auto">
              <span className="text-5xl font-bold text-primary-foreground">◎</span>
            </div>
            <div className="absolute -inset-4 rounded-3xl solana-gradient opacity-30 blur-2xl -z-10" />
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Solana Sim Studio</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
          Experience the power of Solana token operations in a safe, simulated environment. 
          No real funds required.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={connectWallet}
            disabled={isConnecting}
            className="solana-gradient text-primary-foreground font-bold text-lg px-10 py-6 rounded-full neon-glow"
          >
            <Wallet className="mr-3 h-6 w-6" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto w-full"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="glass-card rounded-2xl p-6 text-center"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-muted-foreground text-sm mt-12"
      >
        🔒 100% client-side simulation • No real blockchain interaction
      </motion.p>
    </div>
  );
};
