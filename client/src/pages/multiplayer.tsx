import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TopicSelector } from '@/components/game/TopicSelector';
import { MathProblem } from '@/components/game/MathProblem';

interface Player {
  id: string;
  username: string;
  score: number;
  ready: boolean;
}

export default function Multiplayer() {
  const [, navigate] = useLocation();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [players, setPlayers] = useState<Player[]>([]);
  const [username, setUsername] = useState('');
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [showTopicSelector, setShowTopicSelector] = useState(true);
  const [topic, setTopic] = useState<string | null>(null);
  const [grade, setGrade] = useState<number | null>(null);

  // WebSocket setup
  useEffect(() => {
    if (!username) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      websocket.send(JSON.stringify({
        type: 'join',
        username
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [username]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'state':
        setGameState(data.gameState);
        setPlayers(data.players);
        break;
      case 'problem':
        setCurrentProblem(data.problem);
        break;
    }
  };

  const handleTopicSelect = (selectedTopic: string, selectedGrade: number) => {
    setTopic(selectedTopic);
    setGrade(selectedGrade);
    setShowTopicSelector(false);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setShowTopicSelector(true);
    }
  };

  const handleReady = () => {
    ws?.send(JSON.stringify({ type: 'ready' }));
  };

  const handleAnswer = (answer: string) => {
    ws?.send(JSON.stringify({
      type: 'answer',
      answer
    }));
  };

  if (!username) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-600 p-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Enter Your Name</h2>
              <form onSubmit={handleUsernameSubmit}>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name"
                  className="mb-4"
                />
                <Button type="submit" className="w-full">
                  Join Game
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showTopicSelector) {
    return (
      <TopicSelector
        onSelect={handleTopicSelect}
        onClose={() => navigate("/")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-600 p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-white">Multiplayer Math Race</h1>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-8">
            {gameState === 'playing' && currentProblem && (
              <Card>
                <CardContent className="p-8">
                  <MathProblem
                    problem={currentProblem}
                    onAnswer={(correct) => {
                      if (correct) {
                        handleAnswer(currentProblem.answer);
                      }
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {gameState === 'waiting' && (
              <Card>
                <CardContent className="p-8 text-center">
                  <h2 className="text-xl font-bold mb-4">Waiting for Players</h2>
                  <p className="text-gray-600 mb-4">
                    Get ready to compete! The game will start when all players are ready.
                  </p>
                  <Button onClick={handleReady}>
                    I'm Ready!
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-bold mb-4">Players</h2>
                <div className="space-y-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          player.ready ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <span>{player.username}</span>
                      </div>
                      <span className="font-bold">{player.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
