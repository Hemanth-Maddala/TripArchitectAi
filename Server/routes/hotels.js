const express = require("express");
const router = express.Router();
const axios = require("axios");

async function geocode(place) {
  console.log(`Geocoding place: ${place}`);

  const url = "https://nominatim.openstreetmap.org/search";

  const res = await axios.get(url, {
    params: {
      format: "json",
      q: place,
      limit: 1,
    },
    headers: {
      "User-Agent": "my-hotel-app/1.0", // REQUIRED by Nominatim
    },
    timeout: 10000,
  });

  console.log("Geocode raw response:", res.data);

  if (!res.data || res.data.length === 0) {
    throw new Error("Place not found from geocoding API");
  }

  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon),
  };
}


router.get("/search", async (req, res) => {
  try {
    const { place, guests = 2 } = req.query;

    if (!place) {
      return res.status(400).json({ error: "place is required" });
    }

    // 1. Get coordinates
    const trimplace = place.split(" ");
    let { lat, lng } = await geocode(place);

    if (!lat && !lng && trimplace.length>1) {
      ({ lat, lng } = await geocode(trimplace[0] + " " + trimplace[1]));
    }

    if (!lat && !lng) {
      ({ lat, lng } = await geocode(trimplace[0]));
    }


    // const lat=12.3827332;
    // const lng=75.6640715;
    console.log(`Geocoded ${place} to lat=${lat}, lng=${lng}`);

    // 2. Build bbox
    const delta = 0.3;
    const bbox = `${lat - delta},${lat + delta},${lng - delta},${lng + delta}`;

    // 3. Build dates (1 day)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const arrival = today.toISOString().split("T")[0];
    const departure = tomorrow.toISOString().split("T")[0];

    // 4. Call Booking API
    const response = await axios.get(
      "https://apidojo-booking-v1.p.rapidapi.com/properties/list-by-map",
      {
        params: {
          arrival_date: arrival,
          departure_date: departure,
          room_qty: "1",
          guest_qty: String(guests),
          bbox: bbox,
          price_filter_currencycode: "INR",
          order_by: "price",
          languagecode: "en-us",
          offset: "0",
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
        },
      }
    );


    const rawHotels = response.data.result || response.data.search_results || [];
    console.log(response);

    // 5. Simplify data for frontend
    const hotels = rawHotels.map((h) => ({
      id: h.hotel_id,
      name: h.hotel_name,
      price: h.min_total_price,
      currency: h.currencycode || "INR",
      rating: h.review_score,
      ratingText: h.review_score_word,
      image: h.main_photo_url,
      city: h.city_name_en,
      type: h.accommodation_type_name,
    }));

    console.log("hotels => ", hotels);

    res.json({
      place,
      arrival,
      departure,
      guests,
      count: hotels.length,
      hotels,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

module.exports = router;