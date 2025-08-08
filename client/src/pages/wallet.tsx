import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/hooks/use-wallet";
import type { Transaction } from "@shared/schema";

export default function Wallet() {
  const { user } = useWallet();

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", { userId: user?.id }],
    enabled: !!user?.id,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics", user?.id],
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-cinzel text-2xl font-bold text-lavender-300 mb-4">Connect Your Wallet</h2>
          <p className="text-moonlight-300">Please connect your TON wallet to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold mb-6 text-lavender-300">
            Moonlight Wallet
          </h1>
          <p className="text-lg text-moonlight-300 max-w-2xl mx-auto">
            Track your ethereal assets and twilight transactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Overview */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="font-cinzel text-xl font-semibold mb-4 text-lavender-300">Portfolio Overview</h3>
            {analyticsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 bg-twilight-700/50" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-moonlight-300">TON Balance</span>
                  <span className="font-bold text-lavender-300" data-testid="text-ton-balance">
                    {user.tonBalance} TON
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-moonlight-300">NFT Value</span>
                  <span className="font-bold text-lavender-300" data-testid="text-nft-value">
                    {analytics?.totalValue || "0"} TON
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-moonlight-300">Total Cards</span>
                  <span className="font-bold text-lavender-300" data-testid="text-card-count">
                    {analytics?.cardCount || 0}
                  </span>
                </div>
                <hr className="border-twilight-600" />
                <div className="flex justify-between items-center text-lg">
                  <span className="text-moonlight-200 font-semibold">Total Value</span>
                  <span className="font-bold text-lavender-300" data-testid="text-total-value">
                    {analytics?.totalValue || "0"} TON
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2 glass-effect p-6 rounded-xl">
            <h3 className="font-cinzel text-xl font-semibold mb-4 text-lavender-300">Recent Transactions</h3>
            {transactionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg bg-twilight-700/50" />
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-twilight-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "Purchase" ? "bg-green-600" :
                        tx.type === "Sale" ? "bg-red-600" :
                        tx.type === "Enhancement" ? "bg-blue-600" :
                        "bg-purple-600"
                      }`}>
                        <i className={`text-white text-sm ${
                          tx.type === "Purchase" ? "fas fa-plus" :
                          tx.type === "Sale" ? "fas fa-minus" :
                          tx.type === "Enhancement" ? "fas fa-exchange-alt" :
                          "fas fa-trophy"
                        }`}></i>
                      </div>
                      <div>
                        <div className="font-medium text-moonlight-100" data-testid={`text-tx-description-${tx.id}`}>
                          {tx.description}
                        </div>
                        <div className="text-sm text-moonlight-400" data-testid={`text-tx-timestamp-${tx.id}`}>
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "Unknown"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        tx.type === "Purchase" || tx.type === "Reward" ? "text-green-400" :
                        tx.type === "Sale" ? "text-red-400" :
                        "text-blue-400"
                      }`} data-testid={`text-tx-amount-${tx.id}`}>
                        {tx.type === "Purchase" || tx.type === "Enhancement" ? "-" : "+"}
                        {tx.amount} TON
                      </div>
                      <div className="text-sm text-moonlight-400" data-testid={`text-tx-type-${tx.id}`}>
                        {tx.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-moonlight-400">
                <div className="text-6xl mb-4">📊</div>
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="glass-effect border-twilight-600">
            <CardHeader className="text-center pb-2">
              <div className="text-2xl mb-2">📊</div>
              <CardTitle className="font-cinzel font-semibold text-lavender-300">Power Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {analyticsLoading ? (
                <Skeleton className="h-8 mx-auto bg-twilight-700/50" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-moonlight-100" data-testid="text-power-score">
                    {analytics?.powerScore || user.powerScore}
                  </p>
                  <p className="text-sm text-green-400">+12% this week</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-twilight-600">
            <CardHeader className="text-center pb-2">
              <div className="text-2xl mb-2">🏆</div>
              <CardTitle className="font-cinzel font-semibold text-lavender-300">Win Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {analyticsLoading ? (
                <Skeleton className="h-8 mx-auto bg-twilight-700/50" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-moonlight-100" data-testid="text-win-rate">
                    {analytics?.winRate || user.winRate}%
                  </p>
                  <p className="text-sm text-green-400">+5% this month</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-twilight-600">
            <CardHeader className="text-center pb-2">
              <div className="text-2xl mb-2">💎</div>
              <CardTitle className="font-cinzel font-semibold text-lavender-300">Rarity Index</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {analyticsLoading ? (
                <Skeleton className="h-8 mx-auto bg-twilight-700/50" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-moonlight-100" data-testid="text-rarity-index">
                    {analytics?.rarityIndex || "0.0"}
                  </p>
                  <p className="text-sm text-blue-400">Excellent</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-twilight-600">
            <CardHeader className="text-center pb-2">
              <div className="text-2xl mb-2">🌙</div>
              <CardTitle className="font-cinzel font-semibold text-lavender-300">Synergy Level</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {analyticsLoading ? (
                <Skeleton className="h-8 mx-auto bg-twilight-700/50" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-moonlight-100" data-testid="text-synergy-level">
                    {analytics?.synergyLevel || "Novice"}
                  </p>
                  <p className="text-sm text-purple-400">Elite tier</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
