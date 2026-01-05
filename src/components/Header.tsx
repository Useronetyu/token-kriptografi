import { Sun, Moon, Wallet, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const { theme, toggleTheme } = useTheme();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="h-10 w-10 rounded-xl solana-gradient flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">◎</span>
            </div>
            <div className="absolute -inset-1 rounded-xl solana-gradient opacity-30 blur-md -z-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Solana Sim Studio</h1>
            <p className="text-xs text-muted-foreground">Token Vault Simulator</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5 text-yellow-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: -90, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5 text-primary" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <AnimatePresence mode="wait">
            {walletAddress ? (
              <motion.div
                key="connected"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-sm">{truncateAddress(walletAddress)}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={disconnectWallet}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="disconnected"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="solana-gradient text-primary-foreground font-semibold px-6 rounded-full neon-glow hover:opacity-90 transition-opacity"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};
