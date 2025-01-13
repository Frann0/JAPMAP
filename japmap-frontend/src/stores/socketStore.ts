import { makeAutoObservable } from "mobx";
import { createSocket } from "../services/socketService";

export class SocketStore {
  socket: WebSocket | null = null;

  createSocket() {
    this.socket = createSocket()
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  constructor() {
    makeAutoObservable(this);
  }
}
