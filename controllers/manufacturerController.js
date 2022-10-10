const Vehicle = require("../models/Vehicle");
const Manufacturer = require("../models/Manufacturer");
const async = require("async");

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
    res.send("Create Manufacturer Get");
}
exports.createPost = (req, res) => {
    res.send("Create Manufacturer Post");
}

// Delete
exports.deleteGet = (req, res) => {
    res.send("Delete manufacturer Get");
}
exports.deletePost = (req, res) => {
    res.send("Delete Manufacturer Post");
}

// Update
exports.updateGet = (req, res) => {
    res.send("Update Manufacturer Get");
}
exports.updatePost = (req, res) => {
    res.send("Update Manufacturer Post");
}