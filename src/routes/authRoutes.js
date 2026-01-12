const express = require('express');
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/authSchemas');

const router = express.Router();

// Regular authentication routes
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

// OAuth routes - Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res, next) => {
    req.provider = 'google';
    authController.oauthCallback(req, res, next);
  }
);

// OAuth routes - Facebook
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res, next) => {
    req.provider = 'facebook';
    authController.oauthCallback(req, res, next);
  }
);

// OAuth routes - LinkedIn
router.get(
  '/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE' })
);
router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
  (req, res, next) => {
    req.provider = 'linkedin';
    authController.oauthCallback(req, res, next);
  }
);

// OAuth routes - Apple
router.get(
  '/apple',
  passport.authenticate('apple', { scope: ['name', 'email'] })
);
router.post(
  '/apple/callback',
  passport.authenticate('apple', { session: false, failureRedirect: '/login' }),
  (req, res, next) => {
    req.provider = 'apple';
    authController.oauthCallback(req, res, next);
  }
);

module.exports = router;

