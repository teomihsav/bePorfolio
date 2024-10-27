// Import required modules
cors = require("cors");
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");

const client = new OAuth2Client(
	"625073377461-md21kv5a7573uae4hdo9e1q5lvk705ib.apps.googleusercontent.com"
);

const app = express();
const port = 5000; // Define a port number

// Define custom CORS options
const corsOptions = {
	origin: ["https://portfolio.ben.bg", "http://localhost:5173"], // Allow only this domain
	methods: ["GET", "POST", "PUT", "DELETE"], // Allow only these HTTP methods
	allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
	credentials: true, // Allow credentials (like cookies)
};

// Use custom CORS configuration
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Sample data to simulate a simple in-memory database
let users = [
	{ id: 1, name: "John Doe", age: 30 },
	{ id: 2, name: "Jane Smith", age: 25 },
];

// Route to get all users (GET request)
app.get("/users", (req, res) => {
	res.json(users); // Send the list of users as a response
});

// Route to get a specific user by ID (GET request)
app.get("/users/:id", (req, res) => {
	const userId = parseInt(req.params.id);
	const user = users.find((u) => u.id === userId);

	if (user) {
		res.json(user);
	} else {
		res.status(404).json({ message: "User not found" });
	}
});

// Route to add a new user (POST request)
app.post("/users", (req, res) => {
	const newUser = {
		id: users.length + 1,
		name: req.body.name,
		age: req.body.age,
	};

	users.push(newUser); // Add the new user to the array
	res.status(201).json(newUser); // Send the new user as a response
});

// Route to update an existing user (PUT request)
app.put("/users/:id", (req, res) => {
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
app.delete("/users/:id", (req, res) => {
	const userId = parseInt(req.params.id);
	users = users.filter((u) => u.id !== userId);

	res.json({ message: "User deleted" });
});

// Route to authenticate a user with Google
app.post("/auth/google", async (req, res) => {
	const { token } = req.body;
	console.log("token:", token);

	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience:
				"625073377461-md21kv5a7573uae4hdo9e1q5lvk705ib.apps.googleusercontent.com",
		});
		const payload = ticket.getPayload();
		console.log(payload);

		// Use payload.sub (user’s Google ID) and other data as needed
		res.json({ message: "User authenticated", user: payload });
	} catch (error) {
		res.status(401).json({ error: "Invalid token" });
	}
});

const sendMail = (msg) => {
	// Create a transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: "ben.bg",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: "contact@ben.bg", // your email address to send email from
			pass: "r7XM6DHbL!Dpi:c", // your gmail account password
		},
	});

	// Setup email data
	let mailOptions = {
		from: '"Comment from Web App" <contact@ben.bg>', // sender address
		to: "contact@ben.bg", // list of receivers
		subject: "Hello from Web App", // Subject line
		text: "Hello world?", // plain text body
		html: `<b>${msg}</b>`, // html body
	};

	// Send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log("SMTP error: ", error);
		}
		console.log("Message sent: %s", info.messageId);
	});
};

app.post("/comment", async (req, res) => {
	const { msg } = req.body;
	console.log("req:", msg);
	let resMail = sendMail(msg);
	console.log("Res:", resMail);
	res.json({ message: "Comment sent" });
});

// Start the server
app.listen(port, () => {
	console.log(
		`Server is running on http://localhost:${process.env.PORT || port}`
	);
});
