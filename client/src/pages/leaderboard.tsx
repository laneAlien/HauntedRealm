import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/hooks/use-wallet";

interface LeaderboardEntry {
  id: string;
  userId: string;
  rank: number;
  powerScore: number;
  wins: number;
  title: string;
  period: string;
  user?: {
    id: string;
    username: string;
  };
}

export default function Leaderboard() {
  const { user } = useWallet();
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");

  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard", { period: selectedPeriod }],
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank.toString();
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500 to-yellow-600";
    if (rank === 2) return "from-gray-400 to-gray-500";
    if (rank === 3) return "from-orange-600 to-orange-700";
    return "from-lavender-600 to-lavender-800";
  };

  // Mock top players data for better UI demonstration
  const mockTopPlayers = [
    {
      id: "1",
      userId: "user-top-1",
      rank: 1,
      powerScore: 15847,
      wins: 127,
      title: "Shadow Realm Champion",
      period: selectedPeriod,
      user: { id: "user-top-1", username: "MoonlitMaster" }
    },
    {
      id: "2", 
      userId: "user-top-2",
      rank: 2,
      powerScore: 14692,
      wins: 98,
      title: "Moonlight Tactician",
      period: selectedPeriod,
      user: { id: "user-top-2", username: "EtherealEnchanter" }
    },
    {
      id: "3",
      userId: "user-top-3", 
      rank: 3,
      powerScore: 13245,
      wins: 87,
      title: "Forest Keeper",
      period: selectedPeriod,
      user: { id: "user-top-3", username: "TwilightGuardian" }
    }
  ];

  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : mockTopPlayers;

  // Find user's rank
  const userRank = user ? displayLeaderboard.find(entry => entry.userId === user.id) : null;
  const userEntry = userRank || (user ? {
    id: "user-current",
    userId: user.id,
    rank: 15,
    powerScore: user.powerScore || 8542,
    wins: 34,
    title: "Rising Collector",
    period: selectedPeriod,
    user: { id: user.id, username: user.username }
  } : null);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold mb-6 text-lavender-300">
            Eternal Leaderboard
          </h1>
          <p className="text-lg text-moonlight-300 max-w-2xl mx-auto">
            Rise through the ranks and claim your place among the legendary collectors
          </p>
        </div>

        <div className="glass-effect p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-cinzel text-xl font-semibold text-lavender-300">Top Collectors</h3>
            <div className="flex gap-2">
              {["Weekly", "Monthly", "AllTime"].map((period) => (
                <Button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  variant={selectedPeriod === period ? "default" : "ghost"}
                  className={`text-sm transition-colors ${
                    selectedPeriod === period
                      ? "bg-twilight-700 hover:bg-twilight-600 text-moonlight-100"
                      : "text-moonlight-300 hover:text-moonlight-100"
                  }`}
                  data-testid={`button-period-${period.toLowerCase()}`}
                >
                  {period === "AllTime" ? "All Time" : period}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg bg-twilight-700/50" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {displayLeaderboard.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-4 bg-twilight-700/30 rounded-lg hover:bg-twilight-700/50 transition-colors"
                  data-testid={`leaderboard-entry-${entry.rank}`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)} text-twilight-900 font-bold text-sm`}>
                    {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                  </div>
                  
                  <div className={`w-10 h-10 bg-gradient-to-r ${
                    entry.rank === 1 ? "from-lavender-600 to-lavender-800" :
                    entry.rank === 2 ? "from-purple-600 to-purple-800" :
                    entry.rank === 3 ? "from-blue-600 to-blue-800" :
                    "from-twilight-600 to-twilight-800"
                  } rounded-full flex items-center justify-center`}>
                    <span className="text-moonlight-100 font-bold text-sm">
                      {entry.user?.username?.slice(0, 2).toUpperCase() || "??"}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-moonlight-100" data-testid={`text-username-${entry.rank}`}>
                      {entry.user?.username || "Unknown Player"}
                    </div>
                    <div className="text-sm text-moonlight-400" data-testid={`text-title-${entry.rank}`}>
                      {entry.title}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lavender-300" data-testid={`text-power-score-${entry.rank}`}>
                      {entry.powerScore.toLocaleString()}
                    </div>
                    <div className="text-sm text-moonlight-400">Power Score</div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <i className={`fas fa-trophy ${
                      entry.rank === 1 ? "text-yellow-500" :
                      entry.rank === 2 ? "text-gray-400" :
                      entry.rank === 3 ? "text-orange-600" :
                      "text-lavender-400"
                    }`}></i>
                    <span className="text-sm font-semibold text-moonlight-100" data-testid={`text-wins-${entry.rank}`}>
                      {entry.wins}
                    </span>
                  </div>
                </div>
              ))}

              {/* Your Rank */}
              {user && userEntry && userEntry.rank > 10 && (
                <>
                  <div className="py-2">
                    <div className="text-center text-moonlight-400 text-sm">...</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-lavender-800/20 rounded-lg border border-lavender-600/30">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-lavender-600 text-moonlight-100 font-bold text-sm">
                      {userEntry.rank}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-lavender-600 to-lavender-800 rounded-full flex items-center justify-center">
                      <span className="text-moonlight-100 font-bold text-sm">
                        {userEntry.user?.username?.slice(0, 2).toUpperCase() || "YU"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-moonlight-100" data-testid="text-user-rank">Your Rank</div>
                      <div className="text-sm text-lavender-300" data-testid="text-user-title">{userEntry.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lavender-300" data-testid="text-user-power-score">
                        {userEntry.powerScore.toLocaleString()}
                      </div>
                      <div className="text-sm text-moonlight-400">Power Score</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="fas fa-trophy text-lavender-400"></i>
                      <span className="text-sm font-semibold text-moonlight-100" data-testid="text-user-wins">
                        {userEntry.wins}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="glass-effect hover:bg-lavender-800/20 text-moonlight-100 px-8 py-3 rounded-xl font-medium transition-all duration-300 border-lavender-600/50"
              data-testid="button-view-full-leaderboard"
            >
              View Full Leaderboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
