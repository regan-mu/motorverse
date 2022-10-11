const Vehicle = require("../models/Vehicle");
const Manufacturer = require("../models/Manufacturer");
const async = require("async");
const {body, validationResult} = require("express-validator");

exports.manufacturerList = (req, res, next) => {
    Manufacturer.find().sort({name: 1}).exec((error, foundMakers) => {
        if (error) {
            return next(error);
        }
        res.render(
            "manufacturerList", 
            {
                title: "All Manufaturers",
                manufacturers: foundMakers
            }
        )
    });
}
exports.manufacturerDetail = (req, res, next) => {
    async.parallel(
        {
            makeVehicles(callback) {
                Vehicle.find({manufacturer: req.params.id}).exec(callback)
            },
            make(callback){
                Manufacturer.findById(req.params.id).exec(callback)
            }
        },
        (error, results) => {
            if (error) {
                return next(error)
            }
            res.render(
                "manufacturerDetail",
                {
                    title: results.make.name,
                    make: results.make,
                    makeVehicles: results.makeVehicles
                }
            )
        }
    )
}

// Create
exports.createGet = (req, res) => {
    res.render("createMake", {title: "Create Make", query: null})
}
exports.createPost = [
    body("make", "Manufacturer Name is required")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("hq", "Must provide company HQ")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("founded")
        .trim()
        .isLength({min: 1})
        .withMessage("Year founded is required")
        .isNumeric()
        .withMessage("Year founded must  be a number")
        .escape(),
    body("website", "Must provide company website")
        .trim()
        .isLength({min: 1}),
    body("description", "Must provide company description")
        .trim()
        .isLength({min: 10})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const query = {
            name: req.body.make,
            headquarter: req.body.hq,
            year_founded: req.body.founded,
            website_url: req.body.website,
            description: req.body.description
        }
        const newMake = new Manufacturer(query);
        if (!errors.isEmpty()) {
            res.render("createMake", {title: "Create Make", query: query})
        } else {
            Manufacturer.findOne({name: req.body.name}).exec((err, foundMake) => {
                if (err) {
                    return next(err);
                }
                if (foundMake) {
                    res.redirect(foundMake.url);
                } else {
                    newMake.save(err => {
                        if(err) {
                            return next(err);
                        }
                        res.redirect(newMake.url);
                    });
                }
            });
        }
    }
]

// Update
exports.updateGet = (req, res) => {
    res.send("Update Manufacturer Get");
}
exports.updatePost = (req, res) => {
    res.send("Update Manufacturer Post");
}