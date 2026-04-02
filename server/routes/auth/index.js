const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const validate = require('../../middlewares/validate.middleware');
const { authentication } = require('../../middlewares/auth.middleware');
const { register, login } = require('../../validations/auth.validation');
const { signUp, signIn, handlerRefreshToken, logout, googleCallback, facebookCallback } = require('../../controllers/auth.controller');
const passport = require('../../configs/passport.config');

router.post('/signup', validate(register), asyncHandler(signUp));
router.post('/login', validate(login), asyncHandler(signIn));
router.get(
    '/google',
    passport.authenticate('google', {
        session: false, // không dùng session vì chúng ta sẽ sử dụng JWT
        scope: ['profile', 'email'] // xin quyền lấy profile
    })
);
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false
    }), 
    asyncHandler(googleCallback)
);
router.get(
    '/facebook',
    passport.authenticate('facebook', {
        session: false,
        scope: ['email']
    })
);
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
        session: false
    }),
    asyncHandler(facebookCallback)
);
router.post('/refresh-token', asyncHandler(handlerRefreshToken));
router.use(authentication);
router.post('/logout', asyncHandler(logout));

module.exports = router;