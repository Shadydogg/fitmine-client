import { useEffect, useState } from "react";
import { NFTMiner } from "../types/nft";
import { useSession } from "../context/SessionContext";
import { api } from "../api/apiClient";

export function useNFTInventory() {
  const { accessToken } = useSession();
  const [nfts, setNfts] = useState<NFTMiner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchNFTs = async () => {
      try {
        const { data } = await api.get("/nft", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNfts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load NFTs");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [accessToken]);

  return { nfts, loading, error };
}
