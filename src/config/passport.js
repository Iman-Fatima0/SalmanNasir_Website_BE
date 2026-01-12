const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const config = require('./env');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userRepository = require('../repositories/userRepository');
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: `${config.CORS_ORIGIN}${config.GOOGLE_CALLBACK_URL}`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userProfile = {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            firstName: profile.name?.givenName || profile.displayName?.split(' ')[0],
            lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '',
            profileImage: profile.photos?.[0]?.value,
          };
          done(null, userProfile);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// Facebook OAuth Strategy
if (config.FACEBOOK_APP_ID && config.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: config.FACEBOOK_APP_ID,
        clientSecret: config.FACEBOOK_APP_SECRET,
        callbackURL: `${config.CORS_ORIGIN}${config.FACEBOOK_CALLBACK_URL}`,
        profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userProfile = {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            firstName: profile.name?.givenName || profile.displayName?.split(' ')[0],
            lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '',
            profileImage: profile.photos?.[0]?.value,
          };
          done(null, userProfile);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// LinkedIn OAuth Strategy
if (config.LINKEDIN_CLIENT_ID && config.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: config.LINKEDIN_CLIENT_ID,
        clientSecret: config.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${config.CORS_ORIGIN}${config.LINKEDIN_CALLBACK_URL}`,
        scope: ['r_emailaddress', 'r_liteprofile'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userProfile = {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            profileImage: profile.photos?.[0]?.value,
          };
          done(null, userProfile);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// Apple OAuth Strategy
if (config.APPLE_CLIENT_ID && config.APPLE_TEAM_ID && config.APPLE_KEY_ID && config.APPLE_PRIVATE_KEY) {
  passport.use(
    new AppleStrategy(
      {
        clientID: config.APPLE_CLIENT_ID,
        teamID: config.APPLE_TEAM_ID,
        keyID: config.APPLE_KEY_ID,
        privateKeyString: config.APPLE_PRIVATE_KEY,
        callbackURL: `${config.CORS_ORIGIN}${config.APPLE_CALLBACK_URL}`,
        scope: ['name', 'email'],
      },
      async (accessToken, refreshToken, idToken, profile, done) => {
        try {
          // Apple provides user info in idToken
          const decoded = require('jsonwebtoken').decode(idToken);
          const userProfile = {
            id: decoded.sub,
            email: decoded.email,
            firstName: profile.name?.firstName || '',
            lastName: profile.name?.lastName || '',
            profileImage: null, // Apple doesn't provide profile images
          };
          done(null, userProfile);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

module.exports = passport;

