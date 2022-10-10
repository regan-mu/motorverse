const Vehicle = require("../models/Vehicle");
const Category = require("../models/Category");
const async = require("async");

// List
exports.categoryList = (req, res, next) => {
    Category.find().exec((error, foundCategories) => {
        if (error) {
            return next(error);
        }
        res.render("categories", {title: "Vehicle Categories", categories: foundCategories});
    });
}

// Detail
exports.categoryDetail = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.params.id).exec(callback);
            },
            categoryVehicles(callback) {
                Vehicle.find({category: req.params.id}).sort({model: 1}).exec(callback);
            }
        },
        (error, results) => {
            if (error) {
                next(error);
            }
            res.render(
                "categoryDetail", 
                {
                    title: results.category.name, 
                    vehicles: results.categoryVehicles,
                    category: results.category
                }
            );
        }
    )
}

// Create
exports.createGet = (req, res) => {
    res.send("Create cat get");
}
exports.createPost = (req, res) => {
    res.send("Create Cat post");
}

// Delete
exports.deleteGet = (req, res) => {
    res.send("Delete Cat Get");
}
exports.deletePost = (req, res) => {
    res.send("Delete Cat Post");
}

// Update
exports.updateGet = (req, res) => {
    res.send("Update Category Get");
}
exports.updatePost = (req, res) => {
    res.send("Update category post")
}