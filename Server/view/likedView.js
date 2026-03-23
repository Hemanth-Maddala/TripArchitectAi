const likedSchema = require("../schema/liked");


// SAVE TRIP
const saveliked = async(req,res)=>{
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

        const likeddata = await likedSchema.create({
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
            data: likeddata
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            msg: "Server error"
        });

    }
};



// GET TRIPS BY USER
const getliked = async(req,res)=>{
    try {

        const {userId} = req.params;

        const liked = await likedSchema.find({userId}).sort({createdAt:-1});

        return res.status(200).json({
            success: true,
            data: liked
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
        const { saveId } = req.params;

        if (!saveId) {
            return res.status(400).json({
                success: false,
                msg: "Trip ID is required"
            });
        }

        const trip = await likedSchema.findById(saveId);

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


const unsavetrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        if (!tripId) {
            return res.status(400).json({
                success: false,
                msg: "Trip ID required"
            });
        }

        const deletedDoc = await likedSchema.findByIdAndDelete(tripId);

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
    saveliked,
    getliked,
    getSingletrip,
    unsavetrip
}