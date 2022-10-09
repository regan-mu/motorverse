const Vehicle = require("../models/Vehicle");
const Manufacturer = require("../models/Manufacturer");
const Category = require("../models/Category");
const async = require("async");

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
            console.log(query)
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
            res.render("vehicleDetail", {title: foundVehicle.name, vehicle:foundVehicle});
        } else {
            const notFound = new Error();
            notFound.message = "No vehicle found";
            notFound.status = 404;
            next(notFound);
        }
    });
}

// Create Vehicle

exports.createGet = (req, res) => {
    res.send("Create Vehicle Get");
}
exports.createPost = (req, res) => {
    res.send("Create Vehicle post");
}

// Delete
exports.deleteGet = (req, res) => {
    res.send("Delete Vehicle Get");
}
exports.deletePost = (req, res) => {
    res.send("Delete Vehicle post");
}

// update
exports.updateGet = (req, res) => {
    res.send("Update Vehicle Get");
}
exports.updatePost = (req, res) => {
    res.send("Update Vehicle post");
}



