import mongoose from 'mongoose'
import {db} from '../models/index.js'

db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to database')
}).catch((err) => {
    console.log('Cannot connected to database', err)
    process.exit()
});