import express from 'express'
import { storeData } from './src/controllers/covidController.js'

const app = express()
const port = 3000

import('./src/configs/db.js')

app.get('/', async (req,res) => {
    const data = await(storeData())
    res.json({
        msg: 'Fetch Data Success!',
        data
    })
})

app.get('*', (req,res) => {
    res.json('Page Not Found')
})

app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})