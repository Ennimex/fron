const mongoose = require('mongoose');

// URL de conexión a MongoDB. Asegúrate de reemplazar <username>, <password>, y <dbname> con tus propios valores.
const mongoURI = 'mongodb+srv://:<db_password>@cluster0.up0ys.mongodb.net/';

// Opciones de conexión
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, options);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1); // Salir del proceso con error
  }
};

module.exports = connectDB;
