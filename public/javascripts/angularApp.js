"use strict";

angular.module("formApp", ["ui.router", "formApp.controllers"])

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state("home", {
		url: "/",
		templateUrl: "/templates/home.ejs"
	})

	.state("form", {
		url: "/form",
		templateUrl: "/templates/form.ejs",
		controller: "formCtrl"
	})

	.state("form.quote-options", {
		url: "/quote-options",
		templateUrl: "/templates/form/form-quote-options.ejs"
	})

	.state("form.personal", {
		url: "/personal",
		templateUrl: "/templates/form/form-personal.ejs"
	})

	.state("form.vehicle", {
		url: "/vehicle",
		templateUrl: "/templates/form/form-vehicle.ejs"
	})

	.state("form.risk", {
		url: "/risk",
		templateUrl: "/templates/form/form-risk.ejs"
	})

	.state("form.license", {
		url: "/license",
		templateUrl: "/templates/form/form-license.ejs"
	})

	.state("form.insurance", {
		url: "/insurance",
		templateUrl: "/templates/form/form-insurance.ejs"
	})

	.state("form.accident", {
		url: "/accident",
		templateUrl: "/templates/form/form-accident.ejs"
	})

	.state("form.review", {
		url: "/review",
		templateUrl: "/templates/form/form-review.ejs"
	})

	.state("form.premium", {
		url: "/premium",
		templateUrl: "/templates/form/form-premium.ejs"
	})

	.state("leads", {
		url: "/leads",
		templateUrl: "/templates/leads.ejs",
		controller: "formCtrl",
		 resolve: {
	    	postPromise: ['leadFactory', function(leads){
	      	return leads.getAll();
    	}]
   	 }
	})

	$urlRouterProvider.otherwise('/');
	
});
