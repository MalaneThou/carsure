var mongoose = require('mongoose');

var LeadSchema = new mongoose.Schema({

    quoteTypeSelected: String,
    firstName: String,
    lastName: String,
    address: String,
    phoneNumber: String,
    email: String,
    age: Number,
    make: String,
    model: String,
    year: String,
    value: Number,
    risk: [],
    carModded: String,
    detail: String,
    modCertified: String,
    licenseType: String,
    yearLength: String,
    twoYearLength: String,
    previousInsurance: String,
    insuranceSelected: String,
    fullYear: String,
    prevAccident: String,
    accidentType: String,
    details: String,
    atFault: String
});

mongoose.model("Lead", LeadSchema);