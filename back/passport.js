require("dotenv").config();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("./models/User");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;

passport.use(
	new LocalStrategy((username, password, done) => {
		console.log("local strategy section");
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				console.log("err");
				console.log(err);
				return done(err);
			}
			if (!user) {
				console.log("incorrect username");
				return done(null, false, { msg: "Incorrect userrname" });
			}

			bcrypt.compare(password, user.password, (err, res) => {
				console.log("bcrpt compare");
				if (res) {
					return done(null, user);
				} else {
					return done(null, false, { msg: "Incorrect password" });
				}
			});
		});
	})
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		},
		function (jwtPayload, cb) {
			console.log("jwt payload");
			//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
			return User.findOneById(jwtPayload.id)
				.then((user) => {
					return cb(null, user);
				})
				.catch((err) => {
					return cb(err);
				});
		}
	)
);
