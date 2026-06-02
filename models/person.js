const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Obtenemos la URL secreta desde el entorno global
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Estructura de un contacto
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Limpieza de IDs de MongoDB para el Frontend
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Exportamos el modelo Person como la interfaz pública del módulo
module.exports = mongoose.model('Person', personSchema)
