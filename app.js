const path = require('path')
const express = require('express')
const { port } = require('./config.json')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const request = require('request')
const Lib = require('./Lib')

const app = express()

app.get('/', (req, res) => {
  res.send({
    error: 'Please provide a job, like: /sage'
  })
})

app.get('/:job', (req, res) => {
  const { job } = req.params

  const url = `https://na.finalfantasyxiv.com/jobguide/${job}/`

  request(url, (error, response, body) => {
    const dom = new JSDOM(body)
    const doc = dom.window.document

    if (doc.querySelector('.error__heading')) {
      res.send({
        error: 'Invalid job provided. Page not found!'
      })
      return
    }

    res.send({
      actions: Lib.getActions(doc)
    })
  })
})

app.get('*', function (req, res) {
  res.sendStatus(404)
})

app.listen(port, () => {
  console.log(`Websocket connected on port ${port}`)
})
