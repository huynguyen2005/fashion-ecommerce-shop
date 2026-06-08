const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const validate = require('../../middlewares/validate.middleware');
const { authentication } = require('../../middlewares/auth.middleware');
const { register, login } = require('../../validations/auth.validation');
const { signUp, signIn, handlerRefreshToken, logout } = require('../../controllers/auth.controller');

router.post('/signup', validate(register), asyncHandler(signUp));
router.post('/login', validate(login), asyncHandler(signIn));
router.post('/refresh-token', asyncHandler(handlerRefreshToken));
router.use(authentication);
router.post('/logout', asyncHandler(logout));

module.exports = router;
