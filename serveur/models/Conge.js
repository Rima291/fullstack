const mongoose = require('mongoose');

// Définition du schéma de Conge avec des validations
const CongeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Assurez-vous que le nom est toujours fourni
        trim: true, // Éliminez les espaces inutiles
        maxlength: 100, // Longueur maximale du nom
    },
    email: {
        type: String,
        required: true, // Assurez-vous que l'email est toujours fourni
        trim: true,
        unique: true, // Unicité des emails
        lowercase: true, // Convertissez les emails en minuscules
        match: [/.+@.+\..+/, 'Veuillez entrer un email valide'], // Validation d'email
    },
    dated: {
        type: Date,
        required: true, // La date de début doit être fournie
    },
    datef: {
        type: Date,
        required: true, // La date de fin doit être fournie
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500, // Longueur maximale de la description
    },
    acceptation: {
        type: String,
        
        default: null, // Valeur par défaut
    },
});



const Conge = mongoose.model('Conge', CongeSchema);

module.exports = Conge;
