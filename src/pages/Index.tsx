import { Header } from '@/components/Header';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'sonner';

const AppContent = () => {
  const { walletAddress } = useWallet();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {walletAddress ? <Dashboard /> : <LandingPage />}
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <AppContent />
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },
          }}
        />
      </WalletProvider>
    </ThemeProvider>
  );
};

export default Index;
