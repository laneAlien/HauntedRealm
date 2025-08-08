import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WalletButton from "@/components/wallet/wallet-button";
import { useWallet } from "@/hooks/use-wallet";

export default function Navigation() {
  const [location] = useLocation();
  const { user } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Collection", href: "/collection", icon: "fas fa-images" },
    { name: "Deck Builder", href: "/deck-builder", icon: "fas fa-layer-group" },
    { name: "Events", href: "/events", icon: "fas fa-calendar-alt" },
    { name: "Leaderboard", href: "/leaderboard", icon: "fas fa-trophy" },
  ];

  const isActiveLink = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer" data-testid="link-home">
              <h1 className="font-cinzel text-xl font-bold text-lavender-300">
                <i className="fas fa-moon mr-2"></i>Haunted Realm
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActiveLink(item.href)
                        ? "text-lavender-300 bg-lavender-800/20"
                        : "text-moonlight-200 hover:text-lavender-300"
                    }`}
                    data-testid={`link-${item.name.toLowerCase().replace(" ", "-")}`}
                  >
                    <i className={`${item.icon} mr-2`}></i>
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link href="/wallet">
                <Button
                  variant="outline"
                  className="bg-twilight-700 hover:bg-twilight-600 text-moonlight-100 border-twilight-600"
                  data-testid="button-wallet-balance"
                >
                  <i className="fas fa-wallet mr-2"></i>
                  {parseFloat(user.tonBalance).toFixed(1)} TON
                </Button>
              </Link>
            )}
            
            <WalletButton />

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-moonlight-200" data-testid="button-mobile-menu">
                  <i className="fas fa-bars"></i>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-twilight-800 border-twilight-700">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="text-center mb-6">
                    <h2 className="font-cinzel text-lg font-bold text-lavender-300">
                      <i className="fas fa-moon mr-2"></i>Haunted Realm
                    </h2>
                  </div>
                  
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-left ${
                          isActiveLink(item.href)
                            ? "text-lavender-300 bg-lavender-800/20"
                            : "text-moonlight-200 hover:text-lavender-300"
                        }`}
                        onClick={() => setIsOpen(false)}
                        data-testid={`mobile-link-${item.name.toLowerCase().replace(" ", "-")}`}
                      >
                        <i className={`${item.icon} mr-3`}></i>
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                  
                  <div className="pt-4 border-t border-twilight-700">
                    <WalletButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
