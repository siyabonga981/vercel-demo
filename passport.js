const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GOOGLE_CLIENT_ID = "129854899273-lcqn71i3tjnqi4662ghabo78rntaffsg.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GITHUB_CLIENT_ID = "0385fa03ee38c8096c90";
const GITHUB_CLIENT_SECRET = "e41b8f756e93ee42d9f6bd0b944ae452c475c8eb";
const passport = require("passport"); // Import Passport


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/api/github/callback"
},

    function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));


passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})