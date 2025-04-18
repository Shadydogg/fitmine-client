import { useEffect, useState } from "react";
import { NFTMiner } from "../types/nft";
import { useSession } from "../context/SessionContext";
import { api } from "../api/apiClient";

export function useNFTInventory() {
  const { session } = useSession();
  const [nfts, setNfts] = useState<NFTMiner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.access_token) return;

    const fetchNFTs = async () => {
      try {
        const { data } = await api.get("/nft", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
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
  }, [session?.access_token]);

  return { nfts, loading, error };
}
