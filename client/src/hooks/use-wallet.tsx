import { useState, useEffect, createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { STORAGE_KEYS } from "@/lib/constants";

interface WalletContextType {
  user: User | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for stored wallet connection on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    const storedWalletAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
    
    if (storedUserId && storedWalletAddress) {
      // Try to restore user session
      fetch(`/api/users/${storedUserId}`)
        .then(res => res.json())
        .then(userData => {
          if (userData && userData.walletAddress === storedWalletAddress) {
            setUser(userData);
          } else {
            // Clear invalid stored data
            localStorage.removeItem(STORAGE_KEYS.USER_ID);
            localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
          }
        })
        .catch(() => {
          // Clear invalid stored data
          localStorage.removeItem(STORAGE_KEYS.USER_ID);
          localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
        });
    }
  }, []);

  const connectWalletMutation = useMutation({
    mutationFn: async () => {
      // Mock TON wallet connection - in production this would integrate with TON Connect
      const mockWalletAddress = `0:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const mockUsername = `TwilightUser${Math.floor(Math.random() * 1000)}`;

      const response = await apiRequest("POST", "/api/wallet/connect", {
        walletAddress: mockWalletAddress,
        username: mockUsername,
      });

      return await response.json();
    },
    onSuccess: (userData: User) => {
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER_ID, userData.id);
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, userData.walletAddress || "");
      
      toast({
        title: "Wallet Connected",
        description: `Welcome to Haunted Realm, ${userData.username}!`,
      });

      // Invalidate queries that depend on user data
      queryClient.invalidateQueries({ queryKey: ["/api/nfts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/decks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Unable to connect wallet. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsConnecting(false);
    },
  });

  const connectWallet = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      // In a real implementation, this would use TON Connect SDK
      // For now, we'll simulate the connection process
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate connection delay
      await connectWalletMutation.mutateAsync();
    } catch (error) {
      setIsConnecting(false);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
    
    // Clear all cached user data
    queryClient.clear();
    
    toast({
      title: "Wallet Disconnected",
      description: "You have been safely disconnected from Haunted Realm.",
    });
  };

  const value: WalletContextType = {
    user,
    isConnected: !!user,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

// Re-export the provider for use in App.tsx
export { WalletProvider as default };
