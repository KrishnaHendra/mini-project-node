import fetch from 'node-fetch'
import {db} from '../models/index.js'

const Data = db.data

export const dataCovid = async () => {
    const url = 'https://data.covid19.go.id/public/api/update.json'
    const res = await fetch(url)
    const data = await res.json()
    return data
}

export const storeData = async (logHistory = {}) => {
    let getFromApi = await dataCovid()

    const newData = {
        penambahan: getFromApi.update.penambahan,
        total: getFromApi.update.total,
        logHistory
    }

    const model = new Data(newData); 
    model.save(function (err, doc) {
        if (err) return console.error(err);
        console.log("Document inserted successfully!");
    });

    return newData
}

const findLastData = async () => {
    const lastOne = await Data.find().sort({$natural: -1}).limit(1)
    if(lastOne.length != 0){
        return lastOne[0]
    }
    return {
        penambahan: {},
        total: {}
    }
} 

export const checkUpdate = async (req, res) => {
    const newData = await dataCovid()
    const lastData = await findLastData()

    const newAdditional = newData.update.penambahan
    const lastAdditional = lastData.penambahan
    const newTotal = newData.update.total
    const lastTotal = lastData.total
    let isDifferent = false

    for (const [key, value] of Object.entries(newAdditional)) {
        if(newAdditional[key] != lastAdditional[key]){
            isDifferent = true
        }
        if(newTotal[key] != lastTotal[key]){
            isDifferent = true
        }
    }     

    const logHistory = {penambahan: lastAdditional, total: lastTotal}

    if(isDifferent){
        // If there is a data change
        storeData(logHistory)
    }else{
        // If there is no data change 
        console.log('No data change!')
    }
}