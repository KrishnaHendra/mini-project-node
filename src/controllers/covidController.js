import fetch from 'node-fetch'
import CronJob from 'node-cron'
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
    
    console.log(getFromApi.update.total)

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

const checkUpdate = async () => {
    const newData = await dataCovid()
    const lastDataCovid = await findLastData()

    const penambahanNew = newData.update.penambahan
    const penambahanLast = lastDataCovid.penambahan
    const totalNew = newData.update.total
    const totalLast = lastDataCovid.total
    let isDifferent = false

    for (const [key, value] of Object.entries(penambahanNew)) {
        if(penambahanNew[key] != penambahanLast[key]){
            isDifferent = true
        }
        if(totalNew[key] != totalLast[key]){
            isDifferent = true
        }
    }     

    const logHistory = {penambahan: penambahanLast, total: totalLast}

    if(isDifferent){
        // If there is a data change
        storeData(logHistory)
    }else{
        // If there is no data change 
        console.log('No data change!')
    }
    
}

const scheduledJobFunction = CronJob.schedule("59 23 * * *", () => {
    checkUpdate()
});

scheduledJobFunction.start();