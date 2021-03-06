// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
    console.log("IT GETS IT")
        // Using the passport.authenticate middleware with our local strategy.
        // If the user has valid login credentials, send them to the members page.
        // Otherwise the user will be sent an error
    app.post("/api/signin", passport.authenticate("local"), function(req, res) {
        console.log("HIT");
        res.json(req.user);
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup", function(req, res) {
        db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                fandoms: req.body.fandoms,
                relationship: req.body.relationship,
                dadJoke: req.body.dadJoke,
                cosplay: req.body.cosplay,
                gif: req.body.gif
            })
            .then(function() {
                res.redirect(307, "/api/signin");
            })
            .catch(function(err) {
                res.status(401).json(err);
            });
    });

    // Route for logging user out
    // app.get("/logout", function(req, res) {
    //     req.logout();
    //     res.redirect("/");
    // });

    // Route for getting some data about our user to be used client side
    app.get("/api/profile:id", function(req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            res.json({
                email: req.user.email,
                id: req.user.id
            });
        }
    });
};