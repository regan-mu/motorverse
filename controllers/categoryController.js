const Vehicle = require("../models/Vehicle");
const Category = require("../models/Category");
const async = require("async");
const {body, validationResult} = require("express-validator");

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
    res.render("createCategory", {
        title: "Create Category",
        query: null
    });
}
exports.createPost = [
    body("name", "Name required")
        .trim()
        .isLength({min: 2})
        .escape(),
    body("description", "Category Description required")
        .trim()
        .isLength({min: 10})
        .escape(),
    (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });
    if (!errors.isEmpty()) {
        res.render("createCategory", {
            title: "Create Category",
            query: category
        });
    } else {
        Category.findOne({name: req.body.name}).exec((err, foundCategory) => {
            if(err) {
                return next(err);
            }
            if (foundCategory) {
                res.redirect(foundCategory.url);
            } else {
                category.save(err => {
                    if(err) {
                        return next(err);
                    } else {
                        res.redirect(category.url);
                    }
                })
            }
        })
    }
}]


// Update
exports.updateGet = (req, res, next) => {
    Category.findById(req.params.id).exec((err, foundCategory) => {
        if (err) {
            next(err);
        }
        if (foundCategory) {
            res.render(
                "createCategory",
                {
                    title: foundCategory.name,
                    query: foundCategory
                }
            )
        } else {
            const notFound = new Error();
            notFound.name="Not found";
            notFound.message="Category not found";
            notFound.status=404;
            next(notFound);
        }
    });
}
exports.updatePost = [
    body("name", "Name required")
        .trim()
        .isLength({min: 2})
        .escape(),
    body("description", "Category Description required")
        .trim()
        .isLength({min: 10})
        .escape(),
    (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id
    });
    if (!errors.isEmpty()) {
        res.render("createCategory", {
            title: "Create Category",
            query: category
        });
    } else {
        Category.findByIdAndUpdate(req.params.id, category).exec(err => {
            if(err) {
                return next(err);
            }
            res.redirect(category.url);
        });
    }
}]