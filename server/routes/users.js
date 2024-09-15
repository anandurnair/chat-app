const express = require('express');
const { register, login, getUserDetails,getUsers, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();
const auth = require('../middlewares/auth');
router.get('/',auth, getUsers);

router.post('/register', register);
router.post('/login', login);
router.get('/getUserDetails',auth, getUserDetails);
router.get('/', getUsers);
router.patch('/updateUser/:id',auth, updateUser);
router.delete('/deleteUser/:id',auth, deleteUser);

module.exports = router;
