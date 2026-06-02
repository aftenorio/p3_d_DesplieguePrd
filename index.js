require('dotenv').config() 
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const Person = require('./models/person') 

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// Obtener todos los contactos desde el módulo de MongoDB
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Obtener información general de la agenda
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const numberOfPersons = persons.length
    const date = new Date()
    response.send(
      `<p>Phonebook has info for ${numberOfPersons} people</p>
       <p>${date}</p>`
    )
  })
})

// Creación de una nueva persona
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Dejamos que Mongoose maneje la obligatoriedad mediante su esquema
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error)) // Pasa el ValidationError al errorHandler
})

// Obtención de una persona individual
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// NUEVO: Eliminación de una persona individual
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// NUEVO: Actualización del número de una persona existente
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// MIDDLEWARES DE CIERRE (Deben ir al final, después de todas las rutas)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
