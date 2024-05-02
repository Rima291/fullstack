const express = require('express');
const router = express.Router();
const Projet = require ('../models/Projet');

router.get('/allProjets', (req, res) =>{
    Projet.find()
    .then(projets => res.json(projets))
    .catch(err => res.json(err))
});

  //create Projes
  router.post("/createprojet", (req, res)=> {
    Projet.create(req.body)
    .then(projets => res.json(projets))
    .catch(err => res.json(err))
  });

  router.get('/getProjet/:id', (req, res) => {
    const id = req.params.id;
    Projet.findById(id) // Suppression de l'objet de requête inutile
        .then(projet => res.json(projet)) // Vérifiez ici le champ 'date'
        .catch(err => res.status(500).json(err)); // Ajout du code d'erreur
});

  //update
router.put('/updateprojet/:id',async ( req, res) =>{
    const id = req.params.id;
    Projet.findByIdAndUpdate({_id:id},
       {name: req.body.name,
        nameequipe: req.body.nameequipe,
        nameclient: req.body.nameclient, 
        date: req.body.date, 
        })
    .then(projes => res.json(projes))
      .catch(err => res.json(err))
  });

  //delete

router.delete('/delete/:id', (req,res) => {
    const id = req.params.id;
    Projet.findByIdAndDelete({_id: id})
    .then(res => res.json(res))
    .catch(err => res.json(err))
  });
  module.exports = router;