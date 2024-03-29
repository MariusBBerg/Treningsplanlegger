// WebSocketService.js
class WebSocketService {
    constructor() {
      this.socket = null;
    }
  
    connect() {
      this.socket = new WebSocket('ws://localhost:8080/ws');
  
      this.socket.onopen = () => {
        console.log('Connected to WebSocket');
      };
  
      this.socket.onclose = () => {
        console.log('Disconnected from WebSocket');
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket connection error:', error);
      };
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }
  
    sendMessage(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.error('WebSocket is not open');
      }
    }
  
    // Add other WebSocket methods as needed
  }
  
  export default WebSocketService;
  