const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;
const vehicleSchema = new Schema(
    {
        model: {required: true, type: String, unique: true},
        yom: {required: true, type: Number},
        color: {required: true, type: String},
        location: {required: true, type: String},
        mileage: {required: true, type: Number},
        category: {type: Schema.Types.ObjectId, ref: "Category", required: true },
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
    return `/motorverse/vehicle/${this._id}`
});
vehicleSchema.virtual("priceFormatted").get(function() {
    const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {currency: "Kes", style:"currency"});
    return CURRENCY_FORMATTER.format(this.price);
});
vehicleSchema.virtual("dateFormatted").get(function() {
   return DateTime.fromJSDate(this.uploadDate).toLocaleString(DateTime.DATE_MED)
});

module.exports = mongoose.model("Vehicle", vehicleSchema);