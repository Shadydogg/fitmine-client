import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useLandInventory } from "../hooks/useLandInventory";
import { useNFTInventory } from "../hooks/useNFTInventory";
import api from "../api/apiClient";

const ManageLandPanel: React.FC = () => {
  const { landId } = useParams();
  const { lands, loading: loadingLands } = useLandInventory();
  const { nfts } = useNFTInventory();
  const { accessToken } = useSession();
  const navigate = useNavigate();

  const land = lands.find((l) => l.id === landId);
  const [selected, setSelected] = useState<string[]>(land?.connectedMinerIds || []);
  const [saving, setSaving] = useState(false);

  if (!land) return <div className="p-6 text-red-400">Земля не найдена</div>;

  const toggleMiner = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id].slice(0, land.slots)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/land/update", {
        landId: land.id,
        connectedMinerIds: selected,
      });
      alert("✅ Земля обновлена");
      navigate("/land/" + land.id);
    } catch (err) {
      alert("❌ Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">⚙️ Управление: {land.name}</h1>
      <p className="text-sm text-gray-400 mb-4">Выбери майнеров для привязки к земле ({selected.length} / {land.slots})</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {nfts.map((nft) => {
          const selectedThis = selected.includes(nft.id);
          return (
            <div
              key={nft.id}
              onClick={() => toggleMiner(nft.id)}
              className={`rounded-lg p-3 cursor-pointer border ${
                selectedThis ? "border-fit-primary bg-zinc-800" : "border-zinc-700 bg-zinc-900"
              } transition-all hover:scale-[1.02]`}
            >
              <p className="text-sm font-medium">🛠️ {nft.rarity} Miner</p>
              <p className="text-xs text-gray-400">Power: {nft.baseHashrate}</p>
              {selectedThis && <p className="text-fit-primary text-xs mt-1">✅ Выбран</p>}
            </div>
          );
        })}
      </div>

      <button
        disabled={saving}
        onClick={handleSave}
        className="mt-6 w-full py-3 bg-fit-gradient text-black font-semibold rounded-xl shadow-glow hover:scale-105 transition"
      >
        💾 Сохранить выбор
      </button>
    </div>
  );
};

export default ManageLandPanel;
