import { useState } from 'react';
import { motion } from 'framer-motion';
import { AssetCards } from '@/components/AssetCards';
import { Leaderboard, Holder } from '@/components/Leaderboard';
import { PriceChart } from '@/components/PriceChart';
import { OperationsCenter } from '@/components/OperationsCenter';
import { TransactionHistory } from '@/components/TransactionHistory';
import { TokenPortfolio } from '@/components/TokenPortfolio';
import { LiquidityPool } from '@/components/LiquidityPool';
import { PriceAlerts } from '@/components/PriceAlerts';
import { Governance } from '@/components/Governance';
import { HolderActivityChart } from '@/components/HolderActivityChart';

export const Dashboard = () => {
  const [selectedHolder, setSelectedHolder] = useState<Holder | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Row 1: Asset Cards (Side by Side) */}
      <div className="mb-6">
        <AssetCards />
      </div>

      {/* Row 2: Top Holders + Activity Chart (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Leaderboard 
          onSelectHolder={setSelectedHolder} 
          selectedHolder={selectedHolder}
        />
        <HolderActivityChart selectedHolder={selectedHolder} />
      </div>

      {/* Row 3: Price Chart + Operations Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PriceChart />
        <OperationsCenter />
      </div>

      {/* Row 4: Token Portfolio + Liquidity Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TokenPortfolio />
        <LiquidityPool />
      </div>

      {/* Row 5: Price Alerts + Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PriceAlerts />
        <Governance />
      </div>

      {/* Transaction History */}
      <TransactionHistory />
    </motion.div>
  );
};
