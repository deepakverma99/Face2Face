const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", ({ signal, to, name }) => {
  io.to(to).emit("callAccepted", { signal, name }); // 👈 send name here
});


	socket.on("leaveCall", ({ to }) => {
  io.to(to).emit("callEnded");
});


	// 🆕 Chat message handling
	socket.on("sendMessage", ({ message, name }) => {
		io.emit("receiveMessage", { message, name });
	});


});



server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));