import express from 'express'
import {dataCovid, storeData} from '../controllers/covidController.js'

const router = express.Router()

router.get('/', async (req,res) => {
    const data = await(dataCovid()) 
    res.json({
        msg: 'Fetch data success',
        data
    })
})
router.post('/', storeData)

export {router}