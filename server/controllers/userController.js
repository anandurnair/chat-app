const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Message = require('../models/message');
const { Op } = require('sequelize');
const register = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, role, password: hashedPassword });
    let token = jwt.sign({ email }, "secretkey", { expiresIn: "1d" });

    res.status(201).json({ user, token ,message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message});
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    let token = jwt.sign({ email }, "secretkey", { expiresIn: "1d" });
    res.json({user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = (req.query.userId || "").replace(/"/g, '');
    console.log("User id is : ",userId)
    if (!userId) {
      return res.status(400).json({ error: 'User ID parameter is required' });
    }


    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log("user is : ",user)

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email']
    });

    const usersList = users.map(user => user.toJSON());

    res.status(200).json(usersList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("use id : ",id)
    const { name, email, phone, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update({ name, email, phone, role });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await Message.destroy({
      where: {
        [Op.or]: [
          { sender_id: id },
          { receiver_id: id }
        ]
      }
    });

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: 'User and associated messages deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};





module.exports = { register, login , getUserDetails , getUsers  , updateUser, deleteUser };
