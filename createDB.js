console.log('This script populates some vehicles');

const async = require('async')
const Vehicle = require('./models/Vehicle')
const Category = require('./models/Category')
const Manufacturer = require('./models/Manufacturer')
require("dotenv").config();


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const vehicles = []
const categories = []
const manufacturers = []

function createVehicle(model, yom, color, location,  mileage, category, doors, description, engine, man, price, img, cb) {
    const vehicleDetails = {
        model: model,
        yom: yom,
        color: color,
        location: location,
        mileage: mileage,
        category: category,
        doors: doors,
        description: description,
        engine_capacity: engine,
        manufacturer: man,
        price: price,
        imageUrl: img
    }
    const vehicle = new Vehicle(vehicleDetails);
    vehicle.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log("New Vehicle: " + vehicle);
        vehicles.push(vehicle)
        cb(null, vehicle)
    });
}

function createCategory(name, description, cb) {
    const categoryDetails = {
        name: name,
        description: description
    }
    const category = new Category(categoryDetails);
    category.save(function(err) {
        if (err) {
            cb(err, null);
            return
        }
        console.log("New Category: " + category)
        categories.push(category)
        cb(null, category)
    })
}

function createManufacturer(name, description, hq, year, website, cb) {
    const manufactDetails = {
        name: name,
        description: description,
        headquarter: hq,
        year_founded: year,
        website_url: website,
    }
    const manufacturer = new Manufacturer(manufactDetails);
    manufacturer.save(function(err) {
        if (err) {
            console.log(err)
            cb(err, null)
            return
        }
        console.log("New Manufacturer: " + manufacturer)
        manufacturers.push(manufacturer)
        cb(null, manufacturer)
    })
}

function vehiclesAdd(cb) {
    async.parallel(
        [
            function(callback){
                createVehicle(
                    "Audi Q5", 
                    2016, 
                    "Orange",
                    "Mombasa",
                    0, 
                    categories[1], 
                    4, 
                    "Audi Q5 is a dream car and a must own for me", 
                    2500, 
                    manufacturers[0], 
                    3500000, 
                    "https://audimediacenter-a.akamaihd.net/system/production/media/98370/images/0b773ba1b7e83af8009856038aad325f728e0610/A210181_overfull.jpg?1611138137",
                    callback
                )
            },
            function(callback){
                createVehicle(
                    "Mercedes E350",
                    2017,
                    "White",
                    "Nairobi",
                    25000,
                    categories[0],
                    4,
                    "I love mercedes",
                    2000,
                    manufacturers[1],
                    3000000,
                    "https://www.motortrend.com/uploads/sites/10/2015/11/2014-mercedes-benz-e-class-350-sport-sedan-angular-front.png?fit=around%7C875:492.1875",
                    callback
                )
            },
            function(callback){
                createVehicle(
                    "Audi A4",
                    2015,
                    "Gray",
                    "Nairobi",
                    31000,
                    categories[0],
                    4,
                    "The Audi A4 is a line of compact executive cars produced since 1994 by the German car manufacturer Audi, a subsidiary of the Volkswagen Group.",
                    2000,
                    manufacturers[0],
                    2450000,
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/2018_Audi_A4_Sport_TDi_Quattro_S-A_2.0.jpg/1600px-2018_Audi_A4_Sport_TDi_Quattro_S-A_2.0.jpg",
                    callback
                )
            }
        ],
        cb
    );
}

function addManufacturer(cb) {
    async.parallel(
        [
            function(callback) {
                createManufacturer(
                    "Audi",
                    "Audi is German vehicle manufacturer",
                    "Germany",
                    1909,
                    "https://www.audi.com/en.html",
                    callback
                )
            },
            function(callback) {
                createManufacturer(
                    "Mercedes",
                    "Mercedes is a German luxury vehicle manufacturer",
                    "Germany",
                    1926,
                    "https://www.mercedes-benz.com/en/",
                    callback
                )
            }
        ], cb
    )
}


function addCategory(cb) {
    async.parallel(
        [
            function(callback) {
                createCategory( 
                    "Sedan", 
                    "sedan or saloon is a passenger car in a three-box configuration with separate compartments for an engine, passengers, and cargo.",
                    callback
                )
            },
            function(callback) {
                createCategory( 
                    "Crossover", 
                    "Crossover utility vehicle (CUV) is a type of automobile with increased ride height that is built on unibody chassis construction shared with passenger cars, as opposed to traditional sport utility vehicles (SUV) which are built on a body-on-frame chassis construction similar to pickup trucks.",
                    callback
                )
            }
        ], cb
    )
}

async.series([
    addCategory,
    addManufacturer,
    vehiclesAdd
], 
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+ err);
    }
    else {
        console.log('Vehicles: '+ manufacturers);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
}
)




