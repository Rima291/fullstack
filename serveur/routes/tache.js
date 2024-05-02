const express = require('express');
const router = express.Router();
const Tache = require ('../models/Tache');
const jwt = require('jsonwebtoken');

const validateToken = require('../middlewares/validateToken'); // Middleware pour valider le token



let io;

const setIoInstance = (ioInstance) => {
  io = ioInstance; // Définissez `io` dans le contexte global
};



router.post('/create', validateToken, async (req, res) => {
  try {
    const {nameprojet, name, description, namedeveloppeur, date, progress } = req.body;

    if (!nameprojet ||!name || !description || !namedeveloppeur || !date || !progress) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const newTache = new Tache({
      nameprojet,
      name,
      description,
      namedeveloppeur,
      date,
      progress,
    });

    const savedTache = await newTache.save();

    // Notifier via WebSockets (optionnel)
    io.emit('tache_created', {
      message: `Une nouvelle tâche a été créée : ${name}`,
      tache: savedTache,
    });

    res.status(201).json({ message: 'Tâche créée avec succès.', tache: savedTache });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la tâche.' });
  }
});

router.get('/myTasks', validateToken, async (req, res) => {
  try {
    const userName = req.user.name; // Nom du développeur extrait du token
    const taches = await Tache.find({ namedeveloppeur: userName }); // Obtenir les tâches pour ce développeur
    res.json(taches);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches.' });
  }
});


router.get('/allTaches', (req, res) =>{
    Tache.find()
    .then(taches => res.json(taches))
    .catch(err => res.json(err))
});

  



  router.get('/getTache/:id', (req,res)=>{
    const id = req.params.id;
    Tache.findById({_id: id})
    .then(taches => res.json(taches))
    .catch(err => res.json(err))
  });
  //update
router.put('/update/:id',async ( req, res) =>{
    const id = req.params.id;
    Tache.findByIdAndUpdate({_id:id},
       {name: req.body.name,
        description: req.body.description,
        namedeveloppeur: req.body.namedeveloppeur, 
        date: req.body.date, 
        })
    .then(taches => res.json(taches))
      .catch(err => res.json(err))
  });

  //delete

router.delete('/delete/:id', (req,res) => {
    const id = req.params.id;
    Tache.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
  });


 
  
  module.exports =  {router, setIoInstance};