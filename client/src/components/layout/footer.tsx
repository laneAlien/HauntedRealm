import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-twilight-800 py-16 border-t border-twilight-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-cinzel text-xl font-bold text-lavender-300 mb-4">
              <i className="fas fa-moon mr-2"></i>Haunted Realm
            </h3>
            <p className="text-moonlight-300 mb-4">
              Immerse yourself in an elegant twilight metaverse where gothic romance meets blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-moonlight-300 hover:text-lavender-300 transition-colors"
                data-testid="link-twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="text-moonlight-300 hover:text-lavender-300 transition-colors"
                data-testid="link-discord"
              >
                <i className="fab fa-discord"></i>
              </a>
              <a 
                href="#" 
                className="text-moonlight-300 hover:text-lavender-300 transition-colors"
                data-testid="link-telegram"
              >
                <i className="fab fa-telegram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-cinzel font-semibold text-moonlight-100 mb-4">Game</h4>
            <ul className="space-y-2 text-moonlight-300">
              <li>
                <Link href="/collection">
                  <a className="hover:text-lavender-300 transition-colors" data-testid="link-footer-collection">
                    Collection
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/deck-builder">
                  <a className="hover:text-lavender-300 transition-colors" data-testid="link-footer-deck-builder">
                    Deck Builder
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/events">
                  <a className="hover:text-lavender-300 transition-colors" data-testid="link-footer-tournaments">
                    Tournaments
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/leaderboard">
                  <a className="hover:text-lavender-300 transition-colors" data-testid="link-footer-leaderboard">
                    Leaderboard
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-cinzel font-semibold text-moonlight-100 mb-4">Support</h4>
            <ul className="space-y-2 text-moonlight-300">
              <li>
                <a href="#" className="hover:text-lavender-300 transition-colors" data-testid="link-help-center">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lavender-300 transition-colors" data-testid="link-community">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lavender-300 transition-colors" data-testid="link-bug-reports">
                  Bug Reports
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lavender-300 transition-colors" data-testid="link-contact">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-cinzel font-semibold text-moonlight-100 mb-4">Blockchain</h4>
            <ul className="space-y-2 text-moonlight-300">
              <li>
                <a href="#" className="hover:text-lavender-300 transition-colors" data-testid="link-ton-integration">
                  TON Integration
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lavender-300 transition-colors" data-testid="link-smart-contracts">
                  Smart Contracts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lavender-300 transition-colors" data-testid="link-marketplace">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lavender-300 transition-colors" data-testid="link-staking">
                  Staking
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-twilight-700 mt-12 pt-8 text-center">
          <p className="text-moonlight-400">
            &copy; 2024 Haunted Realm. All rights reserved. Built on TON Blockchain.
          </p>
        </div>
      </div>
    </footer>
  );
}
