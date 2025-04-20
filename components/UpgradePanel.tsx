import React, { useState } from 'react';
import { api } from '../api/apiClient';

interface UpgradePanelProps {
  nftId: string;
  currentLevel: number;
  onUpgraded: (newLevel: number) => void;
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({ nftId, currentLevel, onUpgraded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/nft/upgrade', { nftId });
      if (res.data.ok) {
        onUpgraded(res.data.newLevel);
      } else {
        setError(res.data.error || 'Upgrade failed');
      }
    } catch (err: any) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 text-center">
      <p className="text-sm text-zinc-400 mb-2">Level: {currentLevel}</p>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-300 disabled:opacity-50"
      >
        {loading ? 'Upgrading...' : 'Upgrade Miner (100 FIT)'}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default UpgradePanel;
