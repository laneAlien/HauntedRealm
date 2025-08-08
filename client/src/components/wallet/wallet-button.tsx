import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";

export default function WalletButton() {
  const { user, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();

  if (isConnected && user) {
    return (
      <Button
        onClick={disconnectWallet}
        variant="outline"
        className="bg-twilight-700 hover:bg-twilight-600 text-moonlight-100 border-twilight-600"
        data-testid="button-disconnect-wallet"
      >
        <i className="fas fa-user-circle mr-2"></i>
        {user.username}
      </Button>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-to-r from-lavender-600 to-lavender-800 hover:from-lavender-500 hover:to-lavender-700 text-moonlight-100 font-semibold transition-all duration-300"
      data-testid="button-connect-wallet"
    >
      <i className="fas fa-wallet mr-2"></i>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
