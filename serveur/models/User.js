const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Can't be blank"]
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
  },
  password: {
    type: String,
    required: [true, "Can't be blank"]
  },
  phone: String,
  domaine: String,
  address: String,
  picture: String,
  role: {
    type: String,
    enum: ['admin', 'responsable', 'developpeur', 'rh', 'user'],
    default: 'user' // Définir une valeur par défaut appropriée
  },

  status: {
    type: String,
    default: 'online'
  }
}, { minimize: false });







const User = mongoose.model('User', UserSchema);

module.exports = User;
