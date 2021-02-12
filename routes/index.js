const express = require('express');
const router = express.Router();
const moment = require('moment')
const PaymentModel = require('../models/paymentModel')
const Joi = require('joi');
const axios = require('axios');


async function getUfValue(date) {
    try {
        let response = await axios.get(`https://mindicador.cl/api/uf/${date}`)
        return response.data.serie[0].valor;
    } catch (error) {
        console.log(error);
        return false
    }
}


//REDIRECT TO ALL PAYMENTS FOR ROUTE "/"
router.get('/', async (req, res) => {
    res.redirect("/allPayments")
})


//GET ALL PAYMENTS


router.get('/allPayments', async (req, res) => {
    try {
        const payments = await PaymentModel.find()
        if (payments.length == 0) {
            res.status(200).send({ "message": "No hay datos creados" })
        } else {
            res.status(200).send(payments)
        }
    } catch (error) {
        res.status(500).send({ "message": "Ha ocurrido un error." })
    }
});

//GET PAYMENT BY ID


router.get('/payments/:id', async (req, res) => {
    try {
        const payment = await PaymentModel.findById(req.params.id)
        if (!payment) {
            res.status(404).send({ "message": "No se ha encontrado el pago." })
        } else {
            res.status(200).send(payment)
        }
    } catch (error) {
        if (error.reason.toString().includes("24 hex characters")) {
            res.status(404).send({ "message": "Debes ingresar un id válido." })
        } else {
            res.status(500).send({ "message": "Ha ocurrido un error." })
        }

    }
});


//DELETE PAYMENT 


router.delete('/payments/:id', async (req, res) => {
    console.log("api payments delete");
    try {
        const payment = await PaymentModel.findById(req.params.id)
        if (!payment) {
            res.status(404).send({ "message": "No se ha encontrado el pago." })
        } else {
            await PaymentModel.remove({
                _id: req.params.id
            })
            res.status(200).send({ "message": "payment deleted successfully" })
        }
    } catch (error) {
        console.log(error);
        if (error.reason.toString().includes("24 hex characters")) {
            res.status(404).send({ "message": "Debes ingresar un id válido." })
        } else {
            res.status(500).send({ "message": "Ha ocurrido un error." })
        }

    }
});


//POST CREATE PAYMENT

router.post('/payments', async (req, res) => {
    console.log("api payments create");
    try {
        let ufValue = await getUfValue("07-07-2020");
        if (ufValue == false) {
            res.status(400).send({ "message": "Error al obtener datos de UF" })
        } else {
            const { body } = req;
            const paymentSchema = Joi.object().keys({
                name: Joi.string().required(),
                lastName: Joi.string().required(),
                description: Joi.string().required(),
                serviceHour: Joi.number().required(),
                ammountOfService: Joi.number().required(),
                date: Joi.string().required()
            })
            const result = paymentSchema.validate(body)
            const { error } = result
            const valid = error == null
            if (!valid) {
                res.status(400).send(
                    error.details[0].message
                )
            } else {
                const payment = new PaymentModel(body)
                await payment.save()
                res.status(201).send({
                    message: 'Payment created'
                })
            }
        }
    } catch (error) {
        res.status(500).send("Ha ocurrido un problema " + error.toString())
    }



});


//UPDATE PAYMENT BY ID

router.put('/payments/:id', async (req, res) => {
    console.log("api payments put");
    console.log(req.body);
    try {
        const paymentSchema = Joi.object().keys({
            name: Joi.string().required(),
            lastName: Joi.string().required(),
            description: Joi.string().required(),
            serviceHour: Joi.number().required(),
            ammountOfService: Joi.number().required(),
            date: Joi.string().required(),
            dayAmmountUF: Joi.number().required(),
        })
        const result = paymentSchema.validate(req.body)
        const { error } = result
        const valid = error == null
        if (!valid) {
            res.status(400).send(
                error.details[0].message
            )
        } else {
            await PaymentModel.findByIdAndUpdate({
                _id: req.params.id
            }, req.body)
            res.status(201).send(
                { "message": "Payment updated successfully" }
            )
        }
    } catch (error) {
        if (error.reason.toString().includes("24 hex characters")) {
            res.status(404).send({ "message": "Debes ingresar un id válido." })
        } else {
            res.status(500).send({ "message": "Ha ocurrido un error." })
        }
    }
});

module.exports = router