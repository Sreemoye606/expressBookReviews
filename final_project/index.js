const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here

// Check if the session contains the access token
if (!req.session || !req.session.token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
}

// Extract the token from the session
const token = req.session.token;

// Verify the token
jwt.verify(token, "fingerprint_customer", (err, decoded) => {
    if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    // Add the decoded user information to the request object
    req.user = decoded;
    next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
