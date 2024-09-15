const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    
    const newMessage = await Message.create({ sender_id, receiver_id, message});
    
    res.status(201).json({ newMessage });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all messages between two users (chatId as userId)
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: chatId },
          { receiver_id: chatId }
        ]
      },
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'name'] }, // Ensure attributes are specified
        { model: User, as: 'Receiver', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'ASC']] 
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getChatedUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User id is:", userId);

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'name'] },
        { model: User, as: 'Receiver', attributes: ['id', 'name'] }
      ]
    });

    // Collect unique users from both sender and receiver
    const uniqueUsers = new Set();

    messages.forEach((message) => {
      if (message.Sender.id !== parseInt(userId)) {
        uniqueUsers.add(JSON.stringify({ id: message.Sender.id, name: message.Sender.name }));
      }
      if (message.Receiver.id !== parseInt(userId)) {
        uniqueUsers.add(JSON.stringify({ id: message.Receiver.id, name: message.Receiver.name }));
      }
    });

    const uniqueUserArray = Array.from(uniqueUsers).map((user) => JSON.parse(user));


    res.status(200).json(uniqueUserArray);
  } catch (error) {
    console.error("Error fetching chatted users:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, getMessages, getChatedUsers };
