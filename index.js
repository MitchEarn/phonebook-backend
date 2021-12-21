const express = require('express')
const app = express()

app.use(express.json())


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
   response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const requestDate = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${requestDate}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const getId = () => {
    return Math.floor(Math.random() * (10_000_00))

}

app.post('/api/persons', (request, response) => {
    const newPerson = {
        id: getId(),
        name: request.body.name,
        number: request.body.number
    }
    const foundName = persons.find(p => p.name === newPerson.name)
    if (!request.body.name || !request.body.number) {
        return response.status(404).json({
            error: 'all fields must be supplied'
        })
    } else if (foundName) {
        return response.status(404).json({
            error: 'name must be unique'
        })
    } else {
        persons = persons.concat(newPerson)
        response.send(newPerson)
    }

})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})