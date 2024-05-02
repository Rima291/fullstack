const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Conge = require('../models/Conge');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rymahammami42@gmail.com',
    pass: 'iqme wwtc abmg sbqm'
  }
});

const sendAcceptanceEmail = (email) => {
  const mailOptions = {
    from: 'rymahammami42@gmail.com',
    to: email,
    subject: 'Demande de congé acceptée',
    text: 'Votre demande de congé a été acceptée. Merci!'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

router.post('/exist', async (req, res) => {
  try {
    data = req.body;
    existingConge = await Conge.findOne({ email: data.email });
    res.send({ exists: !!existingConge });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.get('/allConges', (req, res) =>{
  Conge.find()
  .then(Conge => res.json(Conge))
  .catch(err => res.json(err))
});

router.post("/createconge", (req, res)=> {
  Conge.create(req.body)
  .then(conges => {
    res.json(conges);
  })
  .catch(err => res.json(err))
});

router.put('/updateAcceptation/:congeId', async (req, res) => {
  const { congeId } = req.params;
  const { acceptation } = req.body;

  try {
    const updatedConge = await Conge.findByIdAndUpdate(congeId, { acceptation }, { new: true });
    // Send acceptance email
    sendAcceptanceEmail(updatedConge.email);
    res.json(updatedConge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating conge acceptation.' });
  }
});

router.get('/CongesWithoutAcceptations', async (req, res) => {
  try {
    const congeWithoutAcceptations = await Conge.find({ acceptation: null });
    res.json(congeWithoutAcceptations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving conge without acceptation.' });
  }
});

router.get('/congesWithAcceptation', async (req, res) => {
  try {
    const congesWithAcceptation = await Conge.find({ acceptation: { $exists: true, $ne: null } });
    res.json(congesWithAcceptation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving conges with acceptation.' });
  }
});

router.delete('/delete/:id', (req,res) => {
  const id = req.params.id;
  Conge.findByIdAndDelete({_id: id})
  .then(res => res.json(res))
  .catch(err => res.json(err))
});

module.exports = router;
