const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const categorySchema = Schema(
    {
        name: {type: String, required: true, unique: true},
        description: {type: String, required: true},
    }
);

categorySchema.virtual("url").get(function() {
    return `/motorverse/category/${this._id}`
});

module.exports = mongoose.model("Category", categorySchema);
