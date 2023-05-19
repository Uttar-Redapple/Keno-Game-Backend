'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let eventSchema = new Schema({
    event_name: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    event_logo: {
        type: String,
        default: '',
        index: true,
        unique: false
    },
    start_date: {
        type: String,
        default: '',
        index: true,
        unique: false
    },
    end_date: {
        type: String,
        default: '',
        index: true,
        unique: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    },
    created_by:{
        type: String,
        default:''
    },
    created_on: {
        type: Date,
        default: ""
    }
})


mongoose.model('Event', eventSchema);