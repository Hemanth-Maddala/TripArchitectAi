const mongoose = require("mongoose");

const likedSchema = new mongoose.Schema(
{
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    StartingLocation:{
        type: Object,
        default: {}
    },

    DestinationLocation:{
        type: String,
        default: ""
    },

    HighlightDetails:{
        type: Array,
        default: []
    },

    Itinerary:{
        type: Object,
        default: {}
    },

    HotelsData:{
        type: Array,
        default: []
    },

    Weather:{
        type: Object,
        default: {}
    },

    Event:{
        type: Object,
        default: {}
    }

},
{timestamps:true}
);

module.exports = mongoose.model("Liked",likedSchema);