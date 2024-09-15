const express = require('express');
const { sendMessage, getMessages,getChatedUsers } = require('../controllers/messageController');
const router = express.Router();
const auth = require('../middlewares/auth');

router.use(auth);
router.post('/sendMessage', sendMessage);
router.get('/getMessages/:chatId', getMessages);
router.get('/users/:userId',getChatedUsers)


module.exports = router;
