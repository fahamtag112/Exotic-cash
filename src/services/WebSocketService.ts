// WebSocket Service for real-time updates
export interface WebSocketMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export type MessageHandler = (message: WebSocketMessage) => void;

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private url: string;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private reconnectDelay = 3000;
  private isConnected = false;

  private constructor(url: string) {
    this.url = url;
  }

  static getInstance(url: string = 'ws://localhost:5000'): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(url);
    }
    return WebSocketService.instance;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected', { status: 'Connected to server' });
          resolve();
        };

        this.ws.onmessage = (event: MessageEvent) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.isConnected = false;
          this.emit('error', { error: 'WebSocket error occurred' });
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.isConnected = false;
          this.emit('disconnected', { status: 'Disconnected from server' });
          this.attemptReconnect();
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;
      console.log(`Attempting to reconnect in ${delay}ms (Attempt ${this.reconnectAttempts})`);

      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('reconnect-failed', { message: 'Failed to reconnect to server' });
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const handlers = this.messageHandlers.get(message.type) || [];
    handlers.forEach((handler) => handler(message));
  }

  on(eventType: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, []);
    }
    this.messageHandlers.get(eventType)!.push(handler);
  }

  off(eventType: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(eventType: string, data: Record<string, unknown>): void {
    const handlers = this.messageHandlers.get(eventType) || [];
    handlers.forEach((handler) =>
      handler({
        type: eventType,
        data,
        timestamp: Date.now(),
      })
    );
  }

  send(type: string, data: Record<string, unknown>): void {
    if (this.isConnected && this.ws) {
      try {
        this.ws.send(
          JSON.stringify({
            type,
            data,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  subscribe(channel: string): void {
    this.send('subscribe', { channel });
  }

  unsubscribe(channel: string): void {
    this.send('unsubscribe', { channel });
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  isReady(): boolean {
    return this.isConnected && this.ws !== null;
  }
}
