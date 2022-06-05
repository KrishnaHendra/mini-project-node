import express from 'express'
import CronJob from 'node-cron'
import { checkUpdate } from './src/controllers/covidController.js'
import { router } from './src/routes/covidRoutes.js'

const app = express()
const port = 3000

import('./src/configs/db.js')

app.use(router)

CronJob.schedule("59 23 * * *", () => {
    checkUpdate()
});

app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})