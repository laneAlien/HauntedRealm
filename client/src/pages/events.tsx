import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { apiRequest } from "@/lib/queryClient";
import type { Event } from "@shared/schema";

export default function Events() {
  const { user } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState("November 2024");

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const joinEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return await apiRequest("POST", `/api/events/${eventId}/join`, {
        userId: user?.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Successfully Joined!",
        description: "You have been registered for the event.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to join event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600";
      case "Upcoming":
        return "bg-blue-600";
      case "Soon":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "Tournament":
        return "fas fa-trophy";
      case "Challenge":
        return "fas fa-sword";
      case "Gathering":
        return "fas fa-users";
      default:
        return "fas fa-calendar";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-cinzel text-2xl font-bold text-lavender-300 mb-4">Connect Your Wallet</h2>
          <p className="text-moonlight-300">Please connect your TON wallet to view events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-twilight-800 to-twilight-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold mb-6 text-lavender-300">
            Twilight Events
          </h1>
          <p className="text-lg text-moonlight-300 max-w-2xl mx-auto">
            Join mystical tournaments and seasonal gatherings under the moonlit sky
          </p>
        </div>

        {/* Event Calendar */}
        <div className="glass-effect p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-cinzel text-xl font-semibold text-lavender-300">Event Calendar</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-moonlight-300 hover:text-lavender-300" data-testid="button-prev-month">
                <i className="fas fa-chevron-left"></i>
              </Button>
              <span className="font-medium text-moonlight-100 px-4 py-2">{selectedMonth}</span>
              <Button variant="ghost" size="icon" className="text-moonlight-300 hover:text-lavender-300" data-testid="button-next-month">
                <i className="fas fa-chevron-right"></i>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-semibold text-moonlight-300 p-2">{day}</div>
            ))}
            
            {/* Calendar days with some mock events */}
            <div className="p-2 text-moonlight-400">27</div>
            <div className="p-2 text-moonlight-400">28</div>
            <div className="p-2 text-moonlight-400">29</div>
            <div className="p-2 text-moonlight-400">30</div>
            <div className="p-2 text-moonlight-400">31</div>
            <div className="p-2 text-moonlight-100 bg-twilight-700 rounded">1</div>
            <div className="p-2 text-moonlight-100">2</div>
            
            <div className="p-2 text-moonlight-100">3</div>
            <div className="p-2 text-moonlight-100">4</div>
            <div className="p-2 text-moonlight-100 bg-lavender-800 rounded cursor-pointer" title="Moonlight Tournament">5</div>
            <div className="p-2 text-moonlight-100">6</div>
            <div className="p-2 text-moonlight-100">7</div>
            <div className="p-2 text-moonlight-100">8</div>
            <div className="p-2 text-moonlight-100">9</div>
            
            <div className="p-2 text-moonlight-100">10</div>
            <div className="p-2 text-moonlight-100">11</div>
            <div className="p-2 text-moonlight-100">12</div>
            <div className="p-2 text-moonlight-100">13</div>
            <div className="p-2 text-moonlight-100">14</div>
            <div className="p-2 text-moonlight-100 bg-purple-800 rounded cursor-pointer" title="Shadow Realm Challenge">15</div>
            <div className="p-2 text-moonlight-100">16</div>
          </div>
        </div>

        {/* Current Events */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl bg-twilight-700/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="glass-effect border-twilight-600">
                <CardHeader className="p-0">
                  <img
                    src={event.imageUrl || "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800"}
                    alt={event.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="font-cinzel font-semibold text-lavender-300" data-testid={`text-event-name-${event.id}`}>
                        {event.name}
                      </CardTitle>
                      <Badge className={`${getStatusColor(event.status)} text-white`}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-moonlight-300 mb-4" data-testid={`text-event-description-${event.id}`}>
                    {event.description}
                  </p>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-moonlight-400">
                        <i className={`${getStatusIcon(event.type)} mr-2`}></i>
                        {event.type === "Tournament" ? "Prize Pool:" : "Reward:"}
                      </span>
                      <span className="text-lavender-300 font-semibold" data-testid={`text-event-prize-${event.id}`}>
                        {event.prizePool} TON
                      </span>
                    </div>
                    {event.maxParticipants && (
                      <div className="flex justify-between">
                        <span className="text-moonlight-400">Participants:</span>
                        <span className="text-lavender-300 font-semibold" data-testid={`text-event-participants-${event.id}`}>
                          {event.currentParticipants}/{event.maxParticipants}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-moonlight-400">
                        {event.status === "Active" ? "Ends:" : "Starts:"}
                      </span>
                      <span className={`font-semibold ${
                        event.status === "Active" ? "text-red-400" : 
                        event.status === "Upcoming" ? "text-blue-400" : "text-orange-400"
                      }`} data-testid={`text-event-date-${event.id}`}>
                        {event.status === "Active" ? "2d 14h" : "8d 6h"}
                      </span>
                    </div>
                  </div>
                  
                  {event.status === "Active" ? (
                    <Button
                      onClick={() => joinEventMutation.mutate(event.id)}
                      disabled={joinEventMutation.isPending || 
                        (event.maxParticipants && event.currentParticipants >= event.maxParticipants)}
                      className="w-full bg-gradient-to-r from-lavender-600 to-lavender-800 hover:from-lavender-500 hover:to-lavender-700 text-moonlight-100 py-2 rounded-lg font-semibold transition-all duration-300"
                      data-testid={`button-join-event-${event.id}`}
                    >
                      {joinEventMutation.isPending ? "Joining..." : 
                       (event.maxParticipants && event.currentParticipants >= event.maxParticipants) ? "Event Full" : "Join Tournament"}
                    </Button>
                  ) : event.status === "Upcoming" ? (
                    <Button
                      variant="outline"
                      className="w-full glass-effect hover:bg-blue-900/20 text-moonlight-100 py-2 rounded-lg font-medium transition-all duration-300 border-blue-500/50"
                      data-testid={`button-reminder-event-${event.id}`}
                    >
                      Set Reminder
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full glass-effect hover:bg-orange-900/20 text-moonlight-100 py-2 rounded-lg font-medium transition-all duration-300 border-orange-500/50"
                      data-testid={`button-learn-more-event-${event.id}`}
                    >
                      Learn More
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
