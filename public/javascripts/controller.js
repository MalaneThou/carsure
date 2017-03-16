angular.module('formApp.controllers', [])
//Controller for main form
.controller("formCtrl",
    ["$scope", "carRateFactory", "formFieldFactory", "leadFactory", "dataFactory", "premiumFactory", "excessFeeFactory",
    function($scope, carRateFactory, formFieldFactory, leadFactory, dataFactory, premiumFactory, excessFeeFactory) {
    
        //userInput object -- two way databinding: view and dataFactory
        $scope.userInput = {};
        $scope.userInput.quote = dataFactory.quote;
        $scope.userInput.personal = dataFactory.personal;
        $scope.userInput.vehicle = dataFactory.vehicle;
        $scope.userInput.risk = dataFactory.risk;
        $scope.userInput.modification = dataFactory.modification;
        $scope.userInput.license = dataFactory.license;
        $scope.userInput.insurance = dataFactory.insurance;
        $scope.userInput.accident = dataFactory.accidents;

        //Toggles which quote a user selects
        $scope.quoteSelector = function(qSelect) {
                $scope.userInput.quote.selected = qSelect;
        }

        //Returns array to populate risk checkboxes
        $scope.riskFields = { 
            options: formFieldFactory.risk,
            //Manages risk array
            toggleSelection: function (riskName){
                var idx = $scope.userInput.risk.type.indexOf(riskName);
                if (idx > -1) {
                    $scope.userInput.risk.type.splice(idx, 1);
                } else {
                    $scope.userInput.risk.type.push(riskName);
                }
            }
        };

        //Returns arrays to populate form sections
        $scope.modFields = formFieldFactory.modifications;
        $scope.licenseFields = formFieldFactory.license;
        $scope.insuranceFields = formFieldFactory.insurance;
        $scope.accidentFields = formFieldFactory.accidents;

        //Watches when a person's age and car's value change
        //Pass new values into function to determine car rate
        $scope.$watchCollection("[userInput.personal.age, userInput.vehicle.value]", function(newValues, oldValues, scope) {  
          $scope.carVal = carRateFactory.valueByAge(newValues[0], newValues[1]);
        });

        //Calculate base premium
        $scope.premiumCalculate = function() {
            if($scope.userInput.quote.selected === "third party quote") {return $scope.premumValue = premiumFactory.thirdPartyFee;}
            $scope.premumValue =  premiumFactory.premiumCalculater( $scope.userInput.license.type,$scope.carVal,
                                                                    $scope.userInput.license.yearLength,
                                                                    $scope.userInput.insurance.previousInsurance,
                                                                    $scope.userInput.insurance.insuranceSelected,
                                                                    $scope.userInput.insurance.fullYear,
                                                                    $scope.userInput.accident.accidentType,
                                                                    $scope.userInput.quote.selected );
          
        }


        //Calculate excess 
        $scope.excessCalculate = function() {
            if($scope.userInput.quote.selected === "third party quote") {return $scope.excess = 0;}
            $scope.excess = excessFeeFactory.excessFee( $scope.userInput.license.type,
                                                        $scope.userInput.personal.age,
                                                        $scope.userInput.license.yearLength,
                                                        $scope.userInput.license.twoYearLength );
    
        }   

        //Calculate theft excess
        $scope.theftExcessCalculate = function() {
            if($scope.userInput.quote.selected === "third party quote") {return $scope.theftExcess = 0;}
            $scope.theftExcess = excessFeeFactory.theftExcessFee($scope.userInput.risk.type, $scope.userInput.vehicle.value);
        }

        //refactor and make certified disappear
        $scope.$watch("userInput.modification.carModded", function(newValue, oldValue) {
            $scope.moddedVisible = (newValue === "yes");
            if(!$scope.moddedVisible) {
                $scope.userInput.modification.details = "";
                $scope.userInput.modification.modCertified = "";
            }
        });

         $scope.$watch("userInput.modification.modCertified", function(newValue, oldValue) {
            $scope.certifiedVisible = (newValue === "no");
        });

        $scope.$watch("userInput.license.type", function(newValue, oldValue) {
            if(newValue !== "full") {
                $scope.userInput.license.yearLength = "";
                $scope.userInput.license.twoYearLength = "";
            }
        });

        $scope.$watch("userInput.license.yearLength", function(newValue, oldValue) {
            $scope.licenseVisible = (newValue === "over a year");
            if(!$scope.licenseVisible) {
                $scope.userInput.license.twoYearLength = "";
            }
        });

        $scope.$watch("userInput.insurance.previousInsurance", function(newValue, oldValue) {
            $scope.previousInsuranceVisible = (newValue === "yes");
            if(!$scope.previousInsuranceVisible) {
                $scope.userInput.insurance.insuranceSelected = "";
            }
        });

        $scope.$watch("userInput.insurance.insuranceSelected", function(newValue, oldValue) {
             $scope.fullInsuranceVisible = (newValue === "full");
             if(!$scope.fullInsuranceVisible) {
                $scope.userInput.insurance.fullYear = "";
             }
        });

        $scope.$watch("userInput.accident.prevAccident", function(newValue, oldValue) {
             $scope.accidentVisible = (newValue === "yes");
             if(!$scope.accidentVisible) {
                $scope.userInput.accident.accidentType = "";
             }
        });

        $scope.$watch("userInput.accident.accidentType", function(newValue, oldValue) {
            $scope.convictionVisible = (newValue === "conviction");
            if(!$scope.convictionVisible) {
                $scope.userInput.accident.details = "";
            }
            $scope.faultVisible = (newValue === "accident");
             if(!$scope.faultVisible) {
                $scope.userInput.accident.atFault = "";
            }
        });

        $scope.leads = leadFactory.leads;
        $scope.addLead = function() {
           leadFactory.create({    
            quoteTypeSelected: dataFactory.quote.selected,
            firstName: dataFactory.personal.firstName,
            lastName: dataFactory.personal.lastName,
            address: dataFactory.personal.address,
            phoneNumber: dataFactory.personal.phoneNumber,
            email: dataFactory.personal.email,
            age: dataFactory.personal.age,
            make: dataFactory.vehicle.make,
            model: dataFactory.vehicle.mode,
            year: dataFactory.vehicle.year,
            value: dataFactory.vehicle.value,
            risk: dataFactory.risk.type,
            carModded: dataFactory.modification.carModded,
            detail: dataFactory.modification.details,
            modCertified: dataFactory.modification.modCertified,
            licenseType: dataFactory.license.type,
            yearLength: dataFactory.license.yearLength,
            twoYearLength: dataFactory.license.twoYearLength,
            previousInsurance: dataFactory.insurance.previousInsurance,
            insuranceSelected: dataFactory.insurance.insuranceSelected,
            fullYear: dataFactory.insurance.fullYear,
            prevAccident: dataFactory.accidents.prevAccident,
            accidentType: dataFactory.accidents.accidentType,
            details: dataFactory.accidents.details,
            atFault: dataFactory.accidents.atFault});
        };
         
         $scope.tab = 1;
         $scope.isSet = function(checkTab) {
          return $scope.tab === checkTab;
        };
         $scope.setTab = function(activeTab) {
          $scope.tab = activeTab;
        };

}])


    


.factory("carRateFactory", [function() {
    var service = {};
    var baseValue = 0;

    service.valueByAge = function(dob, carValue) {
        if(dob >= 25){
            overAge(carValue);
        } else {
            underAge(carValue);
        }
        return baseValue;
    }
    
    function overAge(carValue) {
        if(carValue <= 5000) {
            baseValue = 400;
        } else if (carValue <= 7500) {
            baseValue = 450;
        } else if (carValue <= 10000) {
            baseValue = 475;
        } else if (carValue <= 12500) {
            baseValue = 500;
        } else if (carValue <= 15000) {
            baseValue = 525;
        } else if (carValue <= 17500) {
            baseValue = 550;
        } else if (carValue <= 20000) {
            baseValue = 575;
        } else if (carValue <= 22500) {
            baseValue = 600;
        } else if (carValue <= 25000) {
            baseValue = 625;
        } else if (carValue > 25000) {
            baseValue = 650;
        }
        return baseValue;
    }
    
    function underAge(carValue) {
        if(carValue <= 5000) {
            baseValue = 600;
        } else if (carValue <= 7500) {
            baseValue = 630;
        } else if (carValue <= 10000) {
            baseValue = 670;
        } else if (carValue <= 12500) {
            baseValue = 710;
        } else if (carValue <= 15000) {
            baseValue = 770;
        } else if (carValue <= 17500) {
            baseValue = 820;
        } else if (carValue <= 20000) {
            baseValue = 875;
        } else if (carValue <= 22500) {
            baseValue = 930;
        } else if (carValue <= 25000) {
            baseValue = 950;
        } else if (carValue > 25000) {
            baseValue = 970;
        }
        return baseValue;
    }

    return service;
}])

//Factory to store all array to populate form page
.factory("formFieldFactory", [function() {
    return {
        quote: ["full quote", "third party quote"],
        risk: ["v8", "turbo charged engine", "rotary engine"],
        modifications: { 
            isModded: ["yes", "no"],
            isCertified: ["yes", "no"]
        },
        license: {
            licenseType: ["learner", "restricted", "full"],
            yearLength: ["over a year", "under a year"],
            twoYearLength: ["yes", "no"]
        },
        insurance: {
            previousInsurance: ["yes", "no"],
            insuranceOptions: ["full", "third party", "third party full"],
            fullYear: ["yes", "no"]
        },
        accidents:  {
            options: ["yes", "no"],
            accidentType: ["conviction", "accident"],
            atFault: ["yes", "no"]
        }
    }
}])

.factory("leadFactory", ['$http', function($http) {
    var o = {
        leads: ["hello"]
    };

        o.getAll = function() {
        return $http.get('/leads').success(function(data) {
            angular.copy(data, o.leads);
        });
    };

            o.create = function(lead) {
          return $http.post('/leads', lead).success(function(data){
            o.leads.push(data);
          });
};
    return o;
}])

//Factory to store all user input
.factory("dataFactory", [function() {
    return {
        quote: {
            selected: "full quote"
        },
        personal: {
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            email: "",
            age: 0
        },
        vehicle: {
            make: "",
            model: "",
            year: "",
            value: 0
        },
        risk: {
            type: []
        },
        modification: {
            carModded: "no",
            details: "",
            modCertified: ""
        },
        license: {
            type: "learner",
            yearLength: "",
            twoYearLength: ""
        },
        insurance: {
            previousInsurance: "",
            insuranceSelected: "",
            fullYear: ""
        },
        accidents: {
            prevAccident: "",
            accidentType: "",
            details: "",
            atFault: ""
        }
    }
}])

.factory("premiumFactory", [function() {

    var service = {};
    var premiumBase = 0;
    var fee = 25.00;
    var fireLevyFee = 6.08;
    var underYearInsuranceFee = 0;
    var base = 0;
    
    service.thirdPartyFee = (180 + fireLevyFee) * 1.15;

    service.premiumCalculater = function(license, basev, length, prev, insuranceType, full, type) {
        base = basev;
        licenseType(license, base, length, prev);
        underYearFullInsurance(insuranceType, base, full);
        accident(type, base);
        independentFees();
        gstFee();
        
        return premiumBase;
    }
    
    function licenseType(license, base, length, prev) {
        switch (license) {
            case "learner": premiumBase = base * 1.25;
            break;
            case "restricted": premiumBase = base * 1.20;
            break;
            case "full": fullLicense(base, length, prev);
            break;
            default: premiumBase = 0;
        }
    }

    function fullLicense(base, length, prev) {
        premiumBase = base;
        licenseLength(length);
        previousInsurance(prev);
    }

    function licenseLength(fulLength) {
        if (fulLength === "under a year") {
            premiumBase = base * 1.15;
        }
    }

    function previousInsurance(noPrev) {
        if(noPrev === "no") {
            premiumBase += (base * 0.15);
        }
    }

    function underYearFullInsurance(insuranceType, fullLength, base) {
        if((insuranceType === "full") && (fullLength === "no")) {
          underYearInsuranceFee = base * 0.15;
        }
    }

    function accident(type, base) {
        if(type === "accident") {
            premiumBase += (base * 0.25);
        } else if(type === "conviction"){
            alert("Convictions are reffered");
        }
    }

    function independentFees() {
        premiumBase += fee + fireLevyFee;
    }

    function gstFee() {
        premiumBase *= 1.15;
    }

  return service;

}])

//Factory to calculate excess fees
.factory("excessFeeFactory", [function() {

    var service = {}; 
    var excess = 0;
    var theftExcess = 0;

    service.excessFee = function(license, dob, overYear, overTwoYear) {
        if((license === "learner") || (license === "restricted")) {
            excess = 1500;
        } else if (dob >= 25) {
            excess = 500;
        } else {
            excess = 750;
        }
        if((overYear === "under a year") || (overTwoYear === "no")) {
            excess += 400;
        }
        return excess;
    }

    service.theftExcessFee = function(riskArr, carVal) {
        if(riskArr.length >= 1) {
            theftExcess = carVal * 0.15;
            if(theftExcess < 900) {
                theftExcess = 900;
            }
        }
        return theftExcess;
    }
    
    return service;
    
}])

