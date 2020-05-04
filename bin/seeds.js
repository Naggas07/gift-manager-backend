const mongoose = require('mongoose');
//const Model1 = require('../models/model1.model');
//const Model2 = require('../models/model2.model');

const dbtitle = 'base-api';
mongoose.connect(`mongodb://localhost/${dbtitle}`);
//Model1.collection.drop();
//Model2.collection.drop();
