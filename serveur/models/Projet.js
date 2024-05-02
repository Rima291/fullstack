const mongoose = require('mongoose');

const ProjetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true, 
        minlength: 1, 
    },
    nameequipe: {
        type: String,
        required: true,
        trim: true,
    },
    nameclient: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now, 
    },
});

const Projet = mongoose.model('Projet', ProjetSchema);

module.exports = Projet;
