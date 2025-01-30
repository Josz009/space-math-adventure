import { WebSocket, WebSocketServer } from 'ws';
import { type Server } from 'http';
import { log } from './vite';

interface Player {
  id: string;
  ws: WebSocket;
  username: string;
  score: number;
  ready: boolean;
}

interface GameRoom {
  id: string;
  players: Map<string, Player>;
  gameState: 'waiting' | 'playing' | 'finished';
  currentProblem?: any;
  startTime?: number;
}

export class MultiplayerServer {
  private wss: WebSocketServer;
  private rooms: Map<string, GameRoom> = new Map();
  private playerToRoom: Map<string, string> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      const playerId = Math.random().toString(36).substring(7);
      log(`Player ${playerId} connected`, 'websocket');

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(playerId, ws, data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      ws.on('close', () => {
        this.handlePlayerDisconnect(playerId);
      });
    });
  }

  private handleMessage(playerId: string, ws: WebSocket, data: any) {
    switch (data.type) {
      case 'join':
        this.handleJoinGame(playerId, ws, data.username);
        break;
      case 'ready':
        this.handlePlayerReady(playerId);
        break;
      case 'answer':
        this.handleAnswer(playerId, data.answer);
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  private handleJoinGame(playerId: string, ws: WebSocket, username: string) {
    // Find an available room or create a new one
    let room = this.findAvailableRoom();
    if (!room) {
      room = this.createRoom();
    }

    const player: Player = {
      id: playerId,
      ws,
      username,
      score: 0,
      ready: false
    };

    room.players.set(playerId, player);
    this.playerToRoom.set(playerId, room.id);

    // Notify all players in the room
    this.broadcastRoomState(room);
  }

  private handlePlayerReady(playerId: string) {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    const player = room.players.get(playerId);
    if (!player) return;

    player.ready = true;

    // Check if all players are ready
    const allReady = Array.from(room.players.values()).every(p => p.ready);
    if (allReady && room.players.size >= 2) {
      this.startGame(room);
    } else {
      this.broadcastRoomState(room);
    }
  }

  private handleAnswer(playerId: string, answer: string) {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== 'playing') return;

    const player = room.players.get(playerId);
    if (!player) return;

    if (room.currentProblem && answer === room.currentProblem.answer) {
      player.score += 100;
      this.broadcastRoomState(room);

      // Generate new problem for the room
      this.generateNewProblem(room);
    }
  }

  private handlePlayerDisconnect(playerId: string) {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    room.players.delete(playerId);
    this.playerToRoom.delete(playerId);

    if (room.players.size === 0) {
      this.rooms.delete(roomId);
    } else {
      this.broadcastRoomState(room);
    }
  }

  private findAvailableRoom(): GameRoom | undefined {
    for (const [, room] of this.rooms) {
      if (room.gameState === 'waiting' && room.players.size < 4) {
        return room;
      }
    }
    return undefined;
  }

  private createRoom(): GameRoom {
    const roomId = Math.random().toString(36).substring(7);
    const room: GameRoom = {
      id: roomId,
      players: new Map(),
      gameState: 'waiting'
    };
    this.rooms.set(roomId, room);
    return room;
  }

  private startGame(room: GameRoom) {
    room.gameState = 'playing';
    room.startTime = Date.now();
    this.generateNewProblem(room);
    this.broadcastRoomState(room);
  }

  private generateNewProblem(room: GameRoom) {
    // TODO: Generate math problem using the existing math.ts utility
    room.currentProblem = {
      question: "2 + 2",
      answer: "4",
      options: ["3", "4", "5", "6"]
    };
    this.broadcastToRoom(room, {
      type: 'problem',
      problem: room.currentProblem
    });
  }

  private broadcastRoomState(room: GameRoom) {
    const payload = {
      type: 'state',
      gameState: room.gameState,
      players: Array.from(room.players.values()).map(p => ({
        id: p.id,
        username: p.username,
        score: p.score,
        ready: p.ready
      }))
    };
    this.broadcastToRoom(room, payload);
  }

  private broadcastToRoom(room: GameRoom, payload: any) {
    const message = JSON.stringify(payload);
    room.players.forEach(player => {
      player.ws.send(message);
    });
  }
}
