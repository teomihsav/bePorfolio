var express = require("express");
var router = express.Router();

const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const { OAuth2Client } = require("google-auth-library");

/* GET users listing. */
router.post("/", async function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:5173");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Referrer-Policy", "no-referrer-when-downgrade");
	const redirectURL = "http://localhost:5000/oauth";

	const oAuth2Client = new OAuth2Client(
		"625073377461-md21kv5a7573uae4hdo9e1q5lvk705ib.apps.googleusercontent.com",
		"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",
		redirectURL
	);

	// Generate the url that will be used for the consent dialog.
	const authorizeUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: "https://www.googleapis.com/auth/userinfo.profile  openid ",
		prompt: "consent",
	});

	res.json({ url: authorizeUrl });
});

module.exports = router;
