var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require("mongoose");
var Lead = mongoose.model("Lead");

router.get("/leads", function(req, res, next) {
	Lead.find(function(err, leads) {
		if(err) {return next(err);}
		res.json(leads);
	});
});

router.post("/leads", function(req, res, next) {
	var lead = new Lead(req.body);

	lead.save(function(err, lead){
		if(err) {return next(err); }

		res.json(lead);
	});
});


module.exports = router;
