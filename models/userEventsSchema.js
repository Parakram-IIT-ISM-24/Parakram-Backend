const mongoose = require("mongoose");

const userEventsSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true

    },
    EventsRegistered: [
        {
            type: String
        }
    ]

});

module.exports = mongoose.model("UserEvents", userEventsSchema);