require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
const {request, response} = require("express");

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('postBody', (req) => {
    return JSON.stringify(req.body)
})


app.use(morgan(':method :url :res[content-length] - :response-time ms :postBody', {
    skip: (req) => req.method !== 'POST'
}))

app.use(morgan('tiny', {
    skip: (req) => req.method === "POST"
}))


app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })

})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })

        .catch(error => next(error))

})

app.get('/info', async (request, response) => {
    const requestDate = new Date()
    const howMany = await Person.collection.countDocuments()
    response.send(`<p>Phonebook has info for ${howMany} people</p><p>${requestDate}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    })
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body


    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({error: 'person details missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, {
        ...person
    })
        .then(() => response.send(person).end())
        .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})