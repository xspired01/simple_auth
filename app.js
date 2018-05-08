require('dotenv').config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sessions = require("client-sessions");
const bcrypt = require("bcryptjs");
//connect mongoose to mongo database on local host
mongoose.connect("mongodb://localhost/simple_auth");
//===== setup for client-sessions
app.use(sessions({
    cookieName: "session",
    secret: "snowboarding",     //should be long, random string & environment variable
    duration: 10 * 60 * 1000,   //duration in milliseconds. set for 10 minutes
    activeDuration: 5 * 60 * 1000,  //if user is active on site, extend session for add'l 5 minutes
    httpOnly: true,             //don't let JS code access cookies
    secure: true,               //only set cookies over https
    ephemeral: true             //destroy cookies when browser closes
}));
app.use(bodyParser.urlencoded({extended: true}));
//configure view engine
app.set("view engine", "ejs");
//environment variables
const port = process.env.PORT;
const ip = process.env.IP;

//=== User schema
let User = mongoose.model("User", new mongoose.Schema({
    firstName:  {   type: String    },
    lastName:   {   type: String    },
    email:      {   type: String, required: true, unique: true  },
    password:   {   type: String, required: true    } 
}));

//=== routes ===

//root route
app.get("/", function(req, res){
    res.render("landing");
});

//register
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    //declare hash, 14 is current standard for bcrypt work factor, 
    //do not hardcode work factor in production
    let hash = bcrypt.hashSync(req.body.password, 14);
    //override password with hashed value
    req.body.password = hash;
    //declaring user
    let user = new User(req.body);
    user.save(function(err, user){
        console.log(err);
        if(err){
            let error = "Something went wrong. Please try again.";
            //error code 11000 is Mongoose code for duplicate entry
            if (err.code === 11000){
                error = "That email is already taken, please try another."
            }
            return res.render("register", {error: error});
        }
        //must include a session at register b/c when redirected to dashboard
        //with no session, dashboard route redirects to login
        req.session.userId = user._id;
        res.redirect("dashboard");
    });
});

//login route
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    User.findOne({email: req.body.email}, function(err, user){
        if(!user || !bcrypt.compareSync(req.body.password, user.password)){
            console.log(err);
            return res.render("login", {
                error: "Incorrect email or password."
            });
        }
        //implementing client-sessions in login
        req.session.userId = user._id;
        res.redirect("dashboard");
    });
});

//dashboard route
app.get("/dashboard", function(req, res, next){
    if(!(req.session && req.session.userId)){
        return res.redirect("login");
    }
    User.findById(req.session.userId, (err, user) => {
        if(err){
            return next(err);
        }
        if(!user){
            return res.redirect("login");
        }
        res.render("dashboard", {   user: user   });
    });
});

//logout route
app.get('/logout', function(req, res){
    //terminates session using reset function
    req.session.reset();
    res.redirect("/login");
});

//start server
app.listen(port, ip, function(req, res){
    console.log("Server started and listening on PORT: " + port + " and IP: " + ip);
})