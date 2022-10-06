const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const manufacturerSchema = Schema(
    {
        name: {required: true, type: String, unique:  true},
        description: {required: true, type: String},
        headquarter: {required: true, type: String},
        year_founded: {required: true, type: Number},
        website_url: {required: true, type: String},
    }
);

manufacturerSchema.virtual("url").get(function() {
    return `/manufacturer/${this._id}`
});

module.exports = mongoose.model("Manufacturer", manufacturerSchema);