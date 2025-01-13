export const createSocket = () => {
  const socket = new WebSocket("ws://localhost:3000/ws");
  return socket;
}
