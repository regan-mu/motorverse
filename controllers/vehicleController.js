const Vehicle = require("../models/Vehicle");
const Manufacturer = require("../models/Manufacturer");
const Category = require("../models/Category");
const async = require("async");
const {body, validationResult} = require("express-validator");

const vehiclePriceRanges = [
    {label: "Below 500k", value: 500000},
    {label: "500k - 1m", value: 1000000},
    {label: "1m - 1.5m", value: 1500000},
    {label: "1.5m - 2m", value: 2000000},
    {label: "2m - 2.5m", value: 2500000},
    {label: "2.5m - 3m", value: 3000000},
    {label: "Above 3m", value: 3000001}
]

// Index Page
exports.index = (req, res, next) => {
    async.parallel(
        {
            vehicles(callback){
                Vehicle.find()
                .populate("manufacturer")
                .populate("category")
                .sort({uploadDate: -1})
                .limit(8)
                .exec(callback);
            },
            categories(callback) {
                Category.find().sort({name: 1}).exec(callback);
            },
            make(callback){
                Manufacturer.find().sort({name: 1}).exec(callback);
            }
        },
        (error, results) => {
            if (error) {
                return next(error)
            }
            res.render(
                "index", 
                {
                    title: "Motorverse",
                    vehicles: results.vehicles,
                    category: results.categories,
                    make: results.make,
                    priceRanges: vehiclePriceRanges
                }
            );
        }
    );
}

exports.indexPost = (req, res, next) => {
    const query = {
        price: req.body.price,
        category: req.body.category,
        make: req.body.make
    }
    async.parallel(
        {   
            vehicles(callback) {
                if (req.body.price < 3000001) {
                    Vehicle.find()
                    .where("price")
                    .lte(req.body.price)
                    .where("price")
                    .gt(req.body.price - 500001)
                    .where("category")
                    .equals(req.body.category)
                    .where("manufacturer")
                    .equals(req.body.make)
                    .sort({uploadDate: -1})
                    .limit(8)
                    .exec(callback)
                } else {
                    Vehicle.find()
                    .where("price")
                    .gt(req.body.price)
                    .where("category")
                    .equals(req.body.category)
                    .where("manufacturer")
                    .equals(req.body.make)
                    .sort({uploadDate: -1})
                    .limit(8)
                    .exec(callback)
                }
            },
            categories(callback) {
                Category.find().sort({name: 1}).exec(callback);
            },
            make(callback){
                Manufacturer.find().sort({name: 1}).exec(callback);
            }
        },
        (error, results) => {
            if (error) {
                next(error);
            }
            res.render(
                "index", 
                {
                    title: "Motorverse",
                    vehicles: results.vehicles,
                    category: results.categories,
                    make: results.make,
                    query: query,
                    priceRanges: vehiclePriceRanges
                }
            );
        }
    )
}

// Vehicle List
exports.vehicleList = (req, res, next) => {
    Vehicle.find()
    .populate("category")
    .populate("manufacturer")
    .exec((error, allVehicles) => {
        if(error) {
            next(error);
        }
        res.render("vehicleList", {title: "All Vehicles", vehicles: allVehicles});
    })
}

// Vehicle Detail
exports.vehicleDetail = (req, res, next) => {
    Vehicle.findById(req.params.id)
    .populate("category")
    .populate("manufacturer")
    .exec((error, foundVehicle) => {
        if(error) {
            return next(error);
        }
        if (foundVehicle) {
            res.render("vehicleDetail", {title: foundVehicle.model, vehicle:foundVehicle});
        } else {
            const notFound = new Error();
            notFound.message = "No vehicle found";
            notFound.status = 404;
            next(notFound);
        }
    });
}

// Create Vehicle

exports.createGet = (req, res, next) => {
    async.parallel(
        {
            makes(callback) {
                Manufacturer.find({}, "name").sort({name: 1}).exec(callback)
            },
            categories(callback) {
                Category.find({}, "name").sort({name: 1}).exec(callback)
            }
        },
        (error, results) => {
            if (error) {
                return next(error);
            }
            res.render(
                "vehicleCreate", 
                {
                    title: "Add Vehicle",
                    category: results.categories,
                    make: results.makes,
                    query: null
                }
            );
        }
    );
}
exports.createPost = [
    body("model", "Vehicle model required")
        .trim()
        .isLength({min: 2})
        .escape(),
    body("yom", "Year of manufacture required")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("location", "Location Required")
        .trim()
        .isLength({min: 2})
        .escape(),
    body("mileage", "Mileage required")
        .trim()
        .isLength({min:1})
        .escape(),
    body("category", "Must select category")
        .trim()
        .isLength({min: 2})
        .escape(),
    body("doors", "Number of doors required")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("engine", "Engine Capacity required")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("make", "Select manufacturer")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("price", "Vehicle price required")
        .trim()
        .isLength({min: 4})
        .escape(),
    body("imageurl", "Image url required")
        .trim()
        .isLength({min: 1}),
    body("description", "Vehicle Description required")
        .trim()
        .isLength({min: 1})
        .escape()
    ,
    (req, res, next) => {
        const errors = validationResult(req)
        query = {
            model: req.body.model,
            yom: req.body.yom,
            color: req.body.color,
            location: req.body.location,
            mileage: req.body.mileage,
            category: req.body.category,
            doors: req.body.doors,
            engine_capacity: req.body.engine,
            manufacturer: req.body.make,
            price: req.body.price,
            imageUrl: req.body.imageurl,
            description: req.body.description
        }
        const vehicle = new Vehicle(query);

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    makes(callback) {
                        Manufacturer.find({}, "name").exec(callback)
                    },
                    categories(callback) {
                        Category.find({}, "name").exec(callback)
                    }
                },
                (error, results) => {
                    if (error) {
                        return next(error);
                    }
                    res.render(
                        "vehicleCreate", 
                        {
                            title: "Add Vehicle",
                            category: results.categories,
                            make: results.makes,
                            query: query
                        }
                    );
                }
            );
        } else {
            if (req.body.password.trim() === "Regan123App") {
                vehicle.save((err) => {
                    err ? next(err): res.redirect(vehicle.url);
                });
            } else {
                const passwordErr = new Error();
                passwordErr.message = "Enter correct password";
                passwordErr.status = 401;
                passwordErr.name = "Unauthorized";
                next(passwordErr)
            }
        }
    }
]

// Delete
exports.deleteGet = (req, res, next) => {
    Vehicle.findById(req.params.id).exec((err, foundVehicle) => {
        if (err) {
            return next(err);
        }
        if (foundVehicle) {
            res.render("deleteVehicle", {title: "Delete Vehicle", vehicle: foundVehicle});
        } else {
            const vehicleErr = new Error()
            vehicleErr.message = "Vehicle not found"
            vehicleErr.status = 404
            vehicleErr.name = "Not Found"
            next(vehicleErr);
        }
    });
}
exports.deletePost = (req, res, next) => {
    if (req.body.password === "Regan123App") {
        Vehicle.findByIdAndRemove(req.body.id).exec((err, removed) => {
            if (err) {
                return next(err);
            }
            if (removed) {
                res.redirect("/");
            } else {
                res.redirect(`/motorverse/vehicle${res.body.id}/delete`);
            }

        })
    } else {
        const passwordErr = new Error();
        passwordErr.message = "Enter correct password";
        passwordErr.status = 401;
        passwordErr.name = "Unauthorized";
        next(passwordErr);
    }
}

// update
exports.updateGet = (req, res, next) => {
    Vehicle.findById(req.params.id).exec((err, foundVehicle) => {
        if (err) {
            next(err);
        }
        if (foundVehicle) {
            async.parallel(
                {
                    makes(callback) {
                        Manufacturer.find({}, "name").sort({name: 1}).exec(callback)
                    },
                    categories(callback) {
                        Category.find({}, "name").sort({name: 1}).exec(callback)
                    }
                },
                (error, results) => {
                    if (error) {
                        return next(error);
                    }
                    res.render(
                        "vehicleCreate", 
                        {
                            title: "Update Vehicle",
                            category: results.categories,
                            make: results.makes,
                            query: foundVehicle
                        }
                    );
                }
            );
        } else {
            const vehicleErr = new Error()
            vehicleErr.message = "Vehicle not found"
            vehicleErr.status = 404
            vehicleErr.name = "Not Found"
            next(vehicleErr);
        }
    });
}
exports.updatePost = [
        body("model", "Vehicle model required")
            .trim()
            .isLength({min: 2})
            .escape(),
        body("yom", "Year of manufacture required")
            .trim()
            .isLength({min: 1})
            .escape(),
        body("location", "Location Required")
            .trim()
            .isLength({min: 2})
            .escape(),
        body("mileage", "Mileage required")
            .trim()
            .isLength({min:1})
            .escape(),
        body("category", "Must select category")
            .trim()
            .isLength({min: 2})
            .escape(),
        body("doors", "Number of doors required")
            .trim()
            .isLength({min: 1})
            .escape(),
        body("engine", "Engine Capacity required")
            .trim()
            .isLength({min: 1})
            .escape(),
        body("make", "Select manufacturer")
            .trim()
            .isLength({min: 1})
            .escape(),
        body("price", "Vehicle price required")
            .trim()
            .isLength({min: 4})
            .escape(),
        body("imageurl", "Image url required")
            .trim()
            .isLength({min: 1}),
        body("description", "Vehicle Description required")
            .trim()
            .isLength({min: 1})
            .escape()
        ,
        (req, res, next) => {
            const errors = validationResult(req)
            query = {
                model: req.body.model,
                yom: req.body.yom,
                color: req.body.color,
                location: req.body.location,
                mileage: req.body.mileage,
                category: req.body.category,
                doors: req.body.doors,
                engine_capacity: req.body.engine,
                manufacturer: req.body.make,
                price: req.body.price,
                imageUrl: req.body.imageurl,
                description: req.body.description,
                _id: req.params.id
            }
            const vehicle = new Vehicle(query);
    
            if (!errors.isEmpty()) {
                async.parallel(
                    {
                        makes(callback) {
                            Manufacturer.find({}, "name").exec(callback)
                        },
                        categories(callback) {
                            Category.find({}, "name").exec(callback)
                        }
                    },
                    (error, results) => {
                        if (error) {
                            return next(error);
                        }
                        res.render(
                            "vehicleCreate", 
                            {
                                title: "Add Vehicle",
                                category: results.categories,
                                make: results.makes,
                                query: query
                            }
                        );
                    }
                );
            } else {
                if (req.body.password.trim() === "Regan123App") {
                    Vehicle.findByIdAndUpdate(req.params.id, vehicle).exec(err => {
                        if(err) {
                            return next(err);
                        }
                        res.redirect(vehicle.url);
                    });
                } else {
                    const passwordErr = new Error();
                    passwordErr.message = "Enter correct password";
                    passwordErr.status = 401;
                    passwordErr.name = "Unauthorized";
                    next(passwordErr)
                }
            }
        }
]



