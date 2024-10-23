// Import required modules
const express = require("express");
const app = express();
const port = 3000; // Define a port number

// Middleware to parse JSON requests
app.use(express.json());

// Sample data to simulate a simple in-memory database
let users = [
	{ id: 1, name: "John Doe", age: 30 },
	{ id: 2, name: "Jane Smith", age: 25 },
];

// Route to get all users (GET request)
app.get("/api/users", (req, res) => {
	res.json(users); // Send the list of users as a response
});

// Route to get a specific user by ID (GET request)
app.get("/api/users/:id", (req, res) => {
	const userId = parseInt(req.params.id);
	const user = users.find((u) => u.id === userId);

	if (user) {
		res.json(user);
	} else {
		res.status(404).json({ message: "User not found" });
	}
});

// Route to add a new user (POST request)
app.post("/api/users", (req, res) => {
	const newUser = {
		id: users.length + 1,
		name: req.body.name,
		age: req.body.age,
	};

	users.push(newUser); // Add the new user to the array
	res.status(201).json(newUser); // Send the new user as a response
});

// Route to update an existing user (PUT request)
app.put("/api/users/:id", (req, res) => {
	const userId = parseInt(req.params.id);
	const userIndex = users.findIndex((u) => u.id === userId);

	if (userIndex !== -1) {
		users[userIndex] = { ...users[userIndex], ...req.body };
		res.json(users[userIndex]);
	} else {
		res.status(404).json({ message: "User not found" });
	}
});

// Route to delete a user (DELETE request)
app.delete("/api/users/:id", (req, res) => {
	const userId = parseInt(req.params.id);
	users = users.filter((u) => u.id !== userId);

	res.json({ message: "User deleted" });
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});