const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const vehicleSchema = new Schema(
    {
        model: {required: true, type: String, unique: true},
        yom: {required: true, type: Number},
        mileage: {required: true, type: Number},
        category: {type: Schema.Types.ObjectId, ref:"Category", required: true },
        doors: {type: Number, required: true},
        description: {type: String, required: true},
        engine_capacity: {type: Number, required: true},
        manufacturer: {type: Schema.Types.ObjectId, ref: "Manufacturer", required: true},
        price: {type: Number, required: true},
        imageUrl: {type: String, required: true},
        uploadDate: {type: Date, default: Date.now()}
    }
);

vehicleSchema.virtual("url").get(function() {
    return `/vehicle/${this._id}`
});

module.exports = mongoose.model("Vehicle", vehicleSchema);