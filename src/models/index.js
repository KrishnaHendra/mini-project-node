import mongoose from 'mongoose'
import {dbConfig} from '../configs/config.js'
import {covid} from './covidModel.js'

mongoose.Promise = global.Promise
const db = {}
db.mongoose = mongoose
db.url = dbConfig.url
db.data = covid(mongoose)

export {db}