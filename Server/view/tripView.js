const TripHistory = require("../schema/triphistory");


// SAVE TRIP
const savetrip = async (req, res) => {
    try {

        const {
            userId,
            StartingLocation,
            DestinationLocation,
            HighlightDetails,
            Itinerary,
            HotelsData,
            Weather,
            Event
        } = req.body;

        const tripdata = await TripHistory.create({
            userId,
            StartingLocation: StartingLocation || {},
            DestinationLocation: DestinationLocation || "",
            HighlightDetails: HighlightDetails || [],
            Itinerary: Itinerary || {},
            HotelsData: HotelsData || [],
            Weather: Weather || {},
            Event: Event || {}
        });

        return res.status(200).json({
            success: true,
            data: tripdata
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            msg: "Server error"
        });

    }
};



// GET TRIPS BY USER
const gettrip = async (req, res) => {
    try {

        const { userId } = req.params;

        const trips = await TripHistory.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: trips
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            msg: "Server error"
        });

    }
};

const getSingletrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        if (!tripId) {
            return res.status(400).json({
                success: false,
                msg: "Trip ID is required"
            });
        }

        const trip = await TripHistory.findById(tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                msg: "Trip not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: trip
        });

    } catch (error) {
        console.log("Error fetching single trip:", error);

        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};


const deletetrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        if (!tripId) {
            return res.status(400).json({
                success: false,
                msg: "Trip ID required"
            });
        }

        const deletedDoc = await TripHistory.findByIdAndDelete(tripId);

        if (!deletedDoc) {
            return res.status(404).json({
                success: false,
                msg: "Trip not found"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error"
        });
    }
};


module.exports = {
    savetrip,
    gettrip,
    deletetrip,
    getSingletrip
}