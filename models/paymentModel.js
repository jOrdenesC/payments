const mongoose = require('mongoose');
const schema = mongoose.Schema;

const paymentSchema = new schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    serviceHour: {
        type: Number,
        required: true
    },
    ammountOfService: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true,
        default: Date.now()
    },
    dayAmmountUF: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Payments', paymentSchema);