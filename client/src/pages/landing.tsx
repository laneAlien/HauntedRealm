import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { Link } from "wouter";

export default function Landing() {
  const { connectWallet, isConnected, isConnecting } = useWallet();

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080"
            alt="Misty twilight forest landscape"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-twilight-900/70 via-twilight-800/50 to-twilight-900/90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="font-cinzel text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-lavender-300 via-moonlight-100 to-lavender-400 bg-clip-text text-transparent">
              Haunted Realm
            </h1>
            <p className="font-spectral text-xl md:text-2xl mb-4 text-moonlight-200 italic">
              Start Your Spooky NFT Adventure Today!
            </p>
            <p className="text-lg mb-8 text-moonlight-300 max-w-2xl mx-auto leading-relaxed">
              Immerse yourself in an elegant twilight metaverse where gothic romance meets blockchain technology. 
              Collect ethereal NFT character cards and build legendary decks in our moonlit realm.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-lavender-600 to-lavender-800 hover:from-lavender-500 hover:to-lavender-700 text-moonlight-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 moonbeam-glow"
                data-testid="button-connect-wallet"
              >
                <i className="fas fa-wallet mr-3"></i>
                {isConnecting ? "Connecting..." : isConnected ? "Wallet Connected" : "Connect TON Wallet"}
              </Button>
              <Button
                variant="outline"
                className="glass-effect hover:bg-lavender-800/20 text-moonlight-100 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 border-lavender-600/50"
                data-testid="button-watch-trailer"
              >
                <i className="fas fa-play mr-3"></i>Watch Trailer
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="glass-effect p-6 rounded-xl text-center animate-float">
                <div className="text-3xl mb-4">🌙</div>
                <h3 className="font-cinzel text-xl font-semibold mb-2 text-lavender-300">Moonlit Collection</h3>
                <p className="text-moonlight-300">Discover rare ethereal creatures in our twilight gallery</p>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center animate-float" style={{ animationDelay: "0.2s" }}>
                <div className="text-3xl mb-4">⚔️</div>
                <h3 className="font-cinzel text-xl font-semibold mb-2 text-lavender-300">Strategic Battles</h3>
                <p className="text-moonlight-300">Build powerful decks and challenge other collectors</p>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center animate-float" style={{ animationDelay: "0.4s" }}>
                <div className="text-3xl mb-4">🏆</div>
                <h3 className="font-cinzel text-xl font-semibold mb-2 text-lavender-300">Elegant Rewards</h3>
                <p className="text-moonlight-300">Earn exclusive NFTs in moonlight tournaments</p>
              </div>
            </div>

            {isConnected && (
              <div className="mt-12">
                <Link href="/collection">
                  <Button
                    className="bg-twilight-700 hover:bg-twilight-600 text-moonlight-100 px-8 py-3 rounded-xl font-medium transition-all duration-300"
                    data-testid="button-enter-realm"
                  >
                    Enter the Realm
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
