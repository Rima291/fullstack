const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');
const User = require('../models/User'); // Modèle d'utilisateur
const express = require('express');
const router = express.Router();

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone,address,domaine,password,picture } = req.body;
           
        const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
        name,
        email,
        phone,
        address,
        domaine,
        password: hashedPassword,
        picture,
      });
  
      await newUser.save();
        const userId = crypto.randomBytes(16).toString('hex');

        const serverClient = connect(api_key, api_secret, app_id);


        const token = serverClient.createUserToken(userId);

        res.status(200).json({ token, name, email, phone,userId, hashedPassword, domaine,address,phone });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    }
}) ;

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }

        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret);

        const { users } = await client.queryUsers({ email: email });

        if(!users.length) return res.status(400).json({ message: 'User not found' });

        const success = await bcrypt.compare(password, users[0].hashedPassword);

        const token = serverClient.createUserToken(users[0].id);

        if(success) {
            res.status(200).json({ token, name: users[0].name, email, userId: users[0].id, role:user.role});
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }
    } catch (error) {ads
        console.log(error);

        res.status(500).json({ message: error });
    }
});

module.exports = router;