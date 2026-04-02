const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
    'google',
    new GoogleStrategy(
        {//config
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (_accessToken, _refreshToken, profile, done) => {   // process user data
            try {
                const socialUser = {
                    provider: 'google',
                    providerId: profile.id,
                    email: profile.emails?.[0]?.value || null,
                    fullName: profile.displayName || '',
                    avatar: profile.photos?.[0]?.value || null
                };

                return done(null, socialUser);  // req.user = socialUser
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

console.log('FACEBOOK_APP_ID =', process.env.FACEBOOK_APP_ID);
console.log('FACEBOOK_APP_SECRET =', process.env.FACEBOOK_APP_SECRET);
console.log('FACEBOOK_CALLBACK_URL =', process.env.FACEBOOK_CALLBACK_URL);

passport.use(
    'facebook',
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'displayName', 'emails', 'photos']
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const socialUser = {
                    provider: 'facebook',
                    providerId: profile.id,
                    email: profile.emails?.[0]?.value || null,
                    fullName: profile.displayName || '',
                    avatar: profile.photos?.[0]?.value || null
                };

                return done(null, socialUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;