const net = require("net");

const PORT = 45000;
let clients = [];

const server = net.createServer(socket => {
    console.log("New connection:", socket.remoteAddress + ":" + socket.remotePort);
    clients.push(socket);

    socket.on("data", data => {
        // Relay received data to all other clients
        for (const client of clients) {
            if (client !== socket) {
                client.write(data);
            }
        }
    });

    socket.on("close", () => {
        console.log("Client disconnected:", socket.remoteAddress);
        clients = clients.filter(c => c !== socket);
    });

    socket.on("error", err => {
        console.log("Socket error:", err.message);
        clients = clients.filter(c => c !== socket);
    });
});

server.listen(PORT, () => {
    console.log("✅ Relay server running on port " + PORT);
});