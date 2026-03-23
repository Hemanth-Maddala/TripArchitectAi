const express = require('express');
const router = express.Router();
const axios = require('axios');
console.log(process.env.RAPIDAPI_KEY);

router.get("/hotelfacilities", async (req, res) => {
  try {
    const { hotelid } = req.query;
    // const hotelid = 13528015;

    if (!hotelid) {
      return res.status(400).json({ error: "hotelid is required" });
    }

    console.log("Fetching facilities for hotel:", hotelid);

    const response = await axios.get(
      "https://apidojo-booking-v1.p.rapidapi.com/properties/get-facilities",
      {
        params: {
          languagecode: "en-us",
          hotel_ids: String(hotelid),       // if API not Accepting String, then remove String() wrapper, directly pass hotelid
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
        },
      }
    );

    console.log("Facilities response:", response.data);
    // use rawdata = response.data[0];


    res.json(response.data);
  } catch (error) {
    console.error("Facilities error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch hotel facilities" });
  }
});

// router.get("/hotelrooms", async (req, res) => {
//   try {
//     const { hotelid, guests = 2 } = req.query;

//     if (!hotelid) {
//       return res.status(400).json({ error: "hotelid is required" });
//     }

//     // Build dates: today -> tomorrow
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     const arrival = today.toISOString().split("T")[0];
//     const departure = tomorrow.toISOString().split("T")[0];

//     const response = await axios.get(
//       "https://apidojo-booking-v1.p.rapidapi.com/properties/get-rooms",
//       {
//         params: {
//           hotel_id: hotelid,
//           departure_date: departure,
//           arrival_date: arrival,
//           rec_guest_qty: String(guests),
//           rec_room_qty: "1",
//           currency_code: "INR",
//           languagecode: "en-us",
//         },
//         headers: {
//           "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
//           "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
//         },
//       }
//     );
//     console.log("Rooms response:", response.data);

//     // const rawdata = [
//     //   {
//     //     address_trans: "",
//     //     wifi_review_score: { rating: "10.0" },
//     //     block: [
//     //       {
//     //         deposit_required: 0,
//     //         number_of_bathrooms: 1,
//     //         no_cc_object: {
//     //           key: "NoCcKey",
//     //           icon: "bui_credit_card_crossed",
//     //           title: "No credit card needed",
//     //           description: "You'll pay during your stay.",
//     //         },
//     //         bundle_extras: {
//     //           icon: "",
//     //           benefits: [
//     //             {
//     //               title: "Parking",
//     //               catalog_item_id: 1,
//     //               name: "Parking",
//     //               icon: "1859644",
//     //               details: ["Self parking for one vehicle per booked unit per stay."],
//     //               category: "parking",
//     //             },
//     //             {
//     //               catalog_item_id: 12,
//     //               title: "Early check-in",
//     //               category: "flexible_checkin_out",
//     //               name: "Front desk services",
//     //               icon: "1859642",
//     //               details: ["Early check-in from 08:00."],
//     //             },
//     //             {
//     //               icon: "1859645",
//     //               name: "Front desk services",
//     //               details: ["Late check-in until 13:00."],
//     //               category: "flexible_checkin_out",
//     //               title: "Late check-in",
//     //               catalog_item_id: 14,
//     //             },
//     //             {
//     //               details: ["High-speed internet throughout your stay."],
//     //               icon: "1859643",
//     //               name: "Internet",
//     //               category: "internet",
//     //               title: "High-speed internet",
//     //               catalog_item_id: 18,
//     //             },
//     //           ],
//     //           rich_value_add_page_title: "",
//     //           highlighted_text: "Includes 1 parking spot + early check-in + late check-in + high-speed internet",
//     //           has_rich_content: "",
//     //           bundle_id: 865575,
//     //           generated_name: "Parking + early check-in + late check-in + high-speed internet",
//     //           rich_footer: [
//     //             "Contact the property to arrange this service.",
//     //             "All additional services are the responsibility of the property.",
//     //             "Any unused products and services included in the rate are non-refundable.",
//     //           ],
//     //         },
//     //         is_flash_deal: 0,
//     //         rack_rate: { price: "0.00", currency: "INR" },
//     //         max_children_free_age: 12,
//     //         is_mobile_deal: 0,
//     //         package_id: 0,
//     //         paymentterms: {
//     //           cancellation: {
//     //             type_translation: "Non-refundable",
//     //             description: "Note that if canceled, modified, or in case of no-show, the total price of the reservation will be charged.",
//     //             info: {
//     //               date: null,
//     //               is_midnight: null,
//     //               date_before_raw: null,
//     //               refundable: 0,
//     //               timezone_offset: null,
//     //               refundable_date: null,
//     //               date_raw: null,
//     //               time: null,
//     //               time_before_midnight: null,
//     //               date_before: null,
//     //               timezone: null,
//     //             },
//     //             type: "non_refundable",
//     //             guaranteed_non_refundable: 0,
//     //             non_refundable_anymore: 0,
//     //             timeline: {
//     //               nr_stages: 1,
//     //               u_currency_code: "INR",
//     //               currency_code: "INR",
//     //               stages: [
//     //                 {
//     //                   b_state: "NONREF",
//     //                   current_stage: 1,
//     //                   fee_remaining_pretty: "INR 0",
//     //                   fee_pretty: "INR 599",
//     //                   stage_fee_pretty: "INR 599",
//     //                   u_stage_fee: "599.00",
//     //                   amount: "599.00",
//     //                   limit_until: "January 27, 2026 12:00 AM",
//     //                   limit_from_date: "January 27, 2026",
//     //                   amount_pretty: "INR 599",
//     //                   b_number: 1,
//     //                   is_free: 0,
//     //                   stage_fee: 599,
//     //                   limit_until_date: "January 27, 2026",
//     //                   is_effective: 1,
//     //                   text_refundable: "You won't be eligible for a refund if you cancel this booking.",
//     //                   u_fee_remaining_pretty: "INR 0",
//     //                   u_fee: "599.00",
//     //                   limit_timezone: "Madikeri",
//     //                   u_stage_fee_pretty: "INR 599",
//     //                   limit_from_raw: "2026-01-27 00:00:00",
//     //                   u_fee_remaining: "0.00",
//     //                   fee_rounded: 599,
//     //                   text: "If you cancel, you'll pay",
//     //                   limit_from_time: "12:00 AM",
//     //                   limit_from: "January 27, 2026 12:00 AM",
//     //                   effective_number: 0,
//     //                   limit_until_time: "12:00 AM",
//     //                   fee_remaining: 0,
//     //                   fee: 599,
//     //                   stage_translation: "No refund if you cancel",
//     //                   limit_until_raw: "2026-01-27 00:00:00",
//     //                   u_fee_pretty: "INR 599",
//     //                 },
//     //               ],
//     //               policygroup_instance_id: "14/152/-",
//     //             },
//     //             bucket: "SMP_NON_REF",
//     //           },
//     //           prepayment: {
//     //             info: {
//     //               date_before: null,
//     //               time_before_midnight: null,
//     //               refundable: "anytime",
//     //               timezone: null,
//     //               timezone_offset: null,
//     //               date: null,
//     //               prepayment_at_booktime: 0,
//     //               is_midnight: null,
//     //               time: null,
//     //             },
//     //             description: "You'll pay during your stay.",
//     //             extended_type_translation: "No payment needed today",
//     //             type_translation: "No payment needed today",
//     //             simple_translation: "No prepayment",
//     //             type_extended: "non_refundable_prepayment",
//     //             type: "no_prepayment",
//     //             timeline: {
//     //               stages: [
//     //                 {
//     //                   effective_number: 0,
//     //                   limit_from_time: "6:54 AM",
//     //                   limit_from: "February 10, 2026 6:54 AM",
//     //                   limit_until_raw: "2026-02-10 23:59:59",
//     //                   u_fee_pretty: "INR 0",
//     //                   limit_until_time: "11:59 PM",
//     //                   fee_remaining: 599,
//     //                   fee: 0,
//     //                   limit_from_raw: "2026-02-10 06:54:45",
//     //                   u_fee_remaining: "599.00",
//     //                   fee_rounded: 0,
//     //                   text: "Before you stay you'll pay",
//     //                   u_fee: "0.00",
//     //                   u_stage_fee_pretty: "INR 0",
//     //                   limit_timezone: "Madikeri",
//     //                   limit_until_date: "February 10, 2026",
//     //                   is_effective: 1,
//     //                   amount_pretty: "INR 0",
//     //                   limit_from_date: "February 10, 2026",
//     //                   b_number: 0,
//     //                   stage_fee: 0,
//     //                   is_free: 1,
//     //                   u_fee_remaining_pretty: "INR 599",
//     //                   current_stage: 1,
//     //                   fee_remaining_pretty: "INR 599",
//     //                   b_state: "FREE",
//     //                   amount: "0.00",
//     //                   limit_until: "February 10, 2026 11:59 PM",
//     //                   fee_pretty: "INR 0",
//     //                   stage_fee_pretty: "INR 0",
//     //                   u_stage_fee: "0.00",
//     //                 },
//     //                 {
//     //                   amount: "599.00",
//     //                   text: "At the property you'll pay",
//     //                   amount_pretty: "INR 599",
//     //                   is_free: 0,
//     //                   after_checkin: 1,
//     //                 },
//     //               ],
//     //               policygroup_instance_id: "14/152/-",
//     //               currency_code: "INR",
//     //               nr_stages: 2,
//     //               u_currency_code: "INR",
//     //             },
//     //           },
//     //         },
//     //         can_reserve_free_parking: 1,
//     //         refundable_until: "",
//     //         room_surface_in_feet2: 107.639104,
//     //         half_board: 0,
//     //         full_board: 0,
//     //         time_targeting: { release_until_hours: 12, valid: 43533, release_until_days: 0 },
//     //         is_genius_discount_geo: 0,
//     //         extrabed_available: 0,
//     //         block_id: "1352801504_407605490_2_34_0_865575",
//     //         max_occupancy: "2",
//     //         pod_ios_migrate_policies_to_smp_fullon: 0,
//     //         roomtype_id: 9,
//     //         babycots_available: 0,
//     //         smoking: 0,
//     //         genius_discount_percentage: 0,
//     //         b_bsb_campaigns: [],
//     //         rate_type_id: 0,
//     //         room_name: "Budget Double Room",
//     //         min_price: {
//     //           currency: "INR",
//     //           price: "599.00",
//     //           extra_charges_breakdown: {
//     //             extra_charge: [
//     //               {
//     //                 type: "SERVICECHARGE",
//     //                 excluded: 1,
//     //                 charge_amount: "0.0000",
//     //                 currency: "INR",
//     //                 charge_price_mode: 10,
//     //                 name: "Goods & services tax",
//     //                 amount: 29.95,
//     //               },
//     //             ],
//     //             net_price: "599.00",
//     //           },
//     //         },
//     //         is_smart_deal: 0,
//     //         refundable: 0,
//     //         price_breakdown: {
//     //           currency: "INR",
//     //           gross_price: "599.00",
//     //           has_incalculable_charges: 0,
//     //           excluded_charges_detail: null,
//     //           sum_excluded_raw: 29.95,
//     //           all_inclusive_price: 628.95,
//     //           has_tax_exceptions: 0,
//     //         },
//     //         name: "Budget Double Room - Low rate – no money back",
//     //         mealplan: "Breakfast Rs. 99\nDinner Rs. 500",
//     //         room_surface_in_m2: 10,
//     //         cpv2_policy_for_room: {
//     //           min_children_age: 0,
//     //           num_cribs: 0,
//     //           allow_crib_and_extra_bed: 0,
//     //           allows_extra_beds: 0,
//     //           age_considered_as_adult: 0,
//     //           only_free_existing_bed_rules: 1,
//     //           num_existing_beds: 0,
//     //           allow_children: 1,
//     //           is_family: 0,
//     //           filtered_existing_beds_out: 1,
//     //           allows_cribs: 1,
//     //           age_intervals: [],
//     //           allow_existing_beds: 1,
//     //           on_top_infant_occupancy: 0,
//     //           cribs_availability_type: 0,
//     //           num_extra_beds: 0,
//     //         },
//     //         extrabed_available_amount: null,
//     //         all_inclusive: 0,
//     //         incremental_price: [
//     //           {
//     //             currency: "INR",
//     //             extra_charges_breakdown: {
//     //               extra_charge: [
//     //                 {
//     //                   amount: "29.95",
//     //                   name: "Goods & services tax",
//     //                   currency: "INR",
//     //                   charge_price_mode: 10,
//     //                   charge_amount: "0.0000",
//     //                   excluded: 1,
//     //                   type: "SERVICECHARGE",
//     //                 },
//     //               ],
//     //               net_price: "599.00",
//     //             },
//     //             price: "599.00",
//     //           },
//     //         ],
//     //         name_without_policy: "Budget Double Room",
//     //         must_reserve_free_parking: 0,
//     //         room_count: 2,
//     //         number_of_bedrooms: 0,
//     //         max_children_free: 0,
//     //         is_domestic_rate: 0,
//     //         room_id: 1352801504,
//     //         loyalty_reward_data: { reward_detail: [] },
//     //         block_text: {
//     //           policies: [
//     //             {
//     //               class: "POLICY_CANCELLATION",
//     //               content: "Note that if canceled, modified, or in case of no-show, the total price of the reservation will be charged.",
//     //             },
//     //             { content: "No prepayment is needed.", class: "POLICY_PREPAY" },
//     //             {
//     //               mealplan_vector: "34",
//     //               price: 99,
//     //               currencycode: "INR",
//     //               content: "Breakfast Rs. 99\nDinner Rs. 500",
//     //               class: "POLICY_HOTEL_MEALPLAN",
//     //             },
//     //             { content: "General", class: "POLICY_TITLE" },
//     //           ],
//     //         },
//     //         babycots_available_amount: null,
//     //         breakfast_included: 0,
//     //         is_last_minute_deal: 0,
//     //       },
//     //     ],
//     //     b_blackout_android_prepayment_copy: 1,
//     //     arrival_date: "2026-02-10",
//     //     host_name: ["Dream Garden Homestay"],
//     //     hotel_facilities: "91,59,142,158,127,456,455,161,14,15,454,423,4,160,147,47,410,418,70,407,184,5,425,16,141,424,224,101,73,143,225,451,46,457,468,159,118,28,64,484,107,2,485,461,421,406,96,467,450,43,419",
//     //     check_only_x_left: 1,
//     //     cvc_required: "0",
//     //     breakfast_review_score: {
//     //       review_snippet: "",
//     //       review_count: 0,
//     //       review_number: 0,
//     //       rating: 0,
//     //       review_score: 0,
//     //       review_score_word: "",
//     //     },
//     //     hotel_address_line: "Narayani Estate And Homestay Rd Dream Garden,Katakeri,Inside Appandriyappa Eshwar road, 571201 Madikeri, India",
//     //     seen_cc_app_rp_missing_fac: 0,
//     //     host_score_count: 15,
//     //     is_preferred: 0,
//     //     booking_home: {
//     //       group: "hotels_and_others",
//     //       house_rules: [],
//     //       is_vacation_rental: 1,
//     //       is_aparthotel: 0,
//     //       is_single_unit_property: 0,
//     //       checkin_methods: [],
//     //       segment: 0,
//     //       quality_class: null,
//     //       is_single_type_property: 0,
//     //       is_booking_home: 1,
//     //     },
//     //     is_eligible_for_horizontal_scroll: 1,
//     //     wl_dest_id: "city::-2103028",
//     //     is_cpv2_property: 1,
//     //     is_crimea: 0,
//     //     min_room_distribution: { children: [], adults: 2 },
//     //     host_since: "Joined Booking.com on: Jan 31, 2025",
//     //     property_policy_display_details: {
//     //       legal_cases: null,
//     //       nocc: {
//     //         description_details: {
//     //           translation: "All options are bookable without a credit card.",
//     //           tag: "payment_no_cc_needed_uf_all_options_bookable_description",
//     //           placeholder_translation: "All options are bookable without a credit card.",
//     //         },
//     //         policy_type_key: "no_credit_card_all_options",
//     //         is_all_nocc: 1,
//     //         title_details: {
//     //           placeholder_translation: "No credit card needed",
//     //           tag: "payment_no_cc_needed_name",
//     //           translation: "No credit card needed",
//     //         },
//     //       },
//     //     },
//     //     max_rooms_in_reservation: 10,
//     //     hotel_id: 13528015,
//     //     plq_sensitivity: "",
//     //     mobile_discount_percentage: 0,
//     //     total_blocks: 4,
//     //     payment_product: "cash_only",
//     //     is_single_unit_vr: 0,
//     //     timezone: "Asia/Kolkata",
//     //     longitude: 75.7023145246063,
//     //     spoken_languages: ["ml", "kn", "hi", "en-gb"],
//     //     latitude: 12.4226079767257,
//     //     departure_date: "2026-02-11",
//     //     b_max_los_data: {
//     //       is_fullon: 0,
//     //       has_extended_los: 1,
//     //       experiment: "long_stays_android_extend_los_2",
//     //       max_allowed_los: 90,
//     //       extended_los: 90,
//     //       default_los: 45,
//     //     },
//     //     no_cc_object: {
//     //       icon: "bui_credit_card_crossed",
//     //       key: "NoCcKey",
//     //       description: "All options are bookable without a credit card.",
//     //       title: "No credit card needed",
//     //     },
//     //     city_trans: "Madikeri",
//     //     is_exclusive: null,
//     //     recommended_block_title: "Recommended for 2 adults",
//     //     payment_detail: { model: "classic" },
//     //     partially_domestic: 1,
//     //     aggregated_data: {
//     //       common_kitchen_fac: [{ id: 116, name: "Cleaning products" }],
//     //       has_nonrefundable: 1,
//     //       has_seating: 0,
//     //       has_refundable: 0,
//     //       has_kitchen: 0,
//     //     },
//     //     host_score: 8.80000019073486,
//     //     qualifies_for_no_cc_reservation: 1,
//     //     distance_to_cc: 4.13303531712831,
//     //     is_closed: 0,
//     //     domestic_no_cc: 0,
//     //     address_required: 0,
//     //     preferences: [],
//     //     rooms: {
//     //       "1352801504": {
//     //         bed_configurations: [
//     //           {
//     //             bed_types: [
//     //               {
//     //                 name_with_count: "1 full bed",
//     //                 description_imperial: "52–59 inches wide",
//     //                 name: "",
//     //                 bed_type: 2,
//     //                 description: "131–150 cm wide",
//     //                 description_localized: null,
//     //                 count: 1,
//     //               },
//     //             ],
//     //           },
//     //         ],
//     //         private_bathroom_highlight: { has_highlight: 0 },
//     //         private_bathroom_count: 0,
//     //         highlights: [
//     //           { icon: "bui_wifi", translated_name: "Free WiFi" },
//     //           { translated_name: "Cleaning products", id: 116, icon: "bui_clean" },
//     //           { translated_name: "Wake-up service/Alarm clock", id: 13, icon: "bui_alarm" },
//     //           { translated_name: "Garden view", icon: "bui_garden", id: 110 },
//     //           { icon: "bui_soundproof", id: 79, translated_name: "Soundproof" },
//     //         ],
//     //         photos: [
//     //           {
//     //             last_update_date: "2025-12-23 22:46:29",
//     //             url_max300: "https://cf.bstatic.com/xdata/images/hotel/max300/796304321.jpg?k=75cbb2812ffc589caaa3f87d2f6f995f885be4ccaa4121e5a96d4b0301ae3ae5&o=",
//     //             ratio: 0.666666666666667,
//     //             url_640x200: "https://cf.bstatic.com/xdata/images/hotel/640x200/796304321.jpg?k=75cbb2812ffc589caaa3f87d2f6f995f885be4ccaa4121e5a96d4b0301ae3ae5&o=",
//     //             photo_id: 796304321,
//     //             url_square60: "https://cf.bstatic.com/xdata/images/hotel/square60/796304321.jpg?k=75cbb2812ffc589caaa3f87d2f6f995f885be4ccaa4121e5a96d4b0301ae3ae5&o=",
//     //             url_original: "https://cf.bstatic.com/xdata/images/hotel/max500/796304321.jpg?k=75cbb2812ffc589caaa3f87d2f6f995f885be4ccaa4121e5a96d4b0301ae3ae5&o=",
//     //           },
//     //           // ... (additional photos would follow same structure)
//     //         ],
//     //         facilities: [
//     //           { id: 110, name: "Garden view" },
//     //           { id: 30, name: "Fan" },
//     //           { id: 71, name: "Fireplace" },
//     //           { id: 80, name: "Tile/Marble floor" },
//     //           { id: 24, name: "Shared bathroom" },
//     //           { name: "Towels", id: 124 },
//     //           { id: 76, name: "Private entrance" },
//     //           { name: "Cleaning products", id: 116 },
//     //           { id: 141, name: "Toilet paper" },
//     //           { name: "Soundproof", id: 79 },
//     //         ],
//     //         description: "This double room's standout feature is the fireplace. This double room features a shared bathroom, a private entrance and garden views. The unit offers 1 bed.",
//     //       },
//     //     },
//     //     default_language: "en-gb",
//     //     block_count: 4,
//     //     rare_find_state: "NOT_RARE",
//     //     pageview_id: "ddb029924c0e0187",
//     //     is_preferred_plus: 0,
//     //     b_legal_use_neutral_color_for_persuasion_legal: 0,
//     //     last_reservation: { countrycode: null, country: null, time: "" },
//     //     use_new_bui_icon_highlight: 0,
//     //     cc_required: "0",
//     //     seen_cc_app_hp_missing_info: 0,
//     //     room_recommendation: [
//     //       {
//     //         adults: 2,
//     //         block_id: "1352801504_407605490_2_34_0_865575",
//     //         babies: 0,
//     //         number_of_extra_beds: 0,
//     //         total_extra_bed_price_in_hotel_currency: 0,
//     //         total_extra_bed_price: 0,
//     //         children: 0,
//     //       },
//     //     ],
//     //     currency_code: "INR",
//     //     hotel_name_trans: "",
//     //     top_ufi_benefits: [
//     //       { translated_name: "Parking", icon: "parking_sign" },
//     //       { translated_name: "Family rooms", icon: "family" },
//     //       { icon: "wifi", translated_name: "Wifi" },
//     //       { translated_name: "Pet friendly", icon: "pawprint" },
//     //       { translated_name: "Room service", icon: "clean" },
//     //     ],
//     //     is_cash_accepted_check_enabled: 1,
//     //     is_vp2_enrolled: 0,
//     //     hotel_text: {},
//     //     is_hotel_ctrip: 0,
//     //     family_facilities: ["Soundproof rooms", "Family rooms"],
//     //     b_sca_flow_property_user_ip: 0,
//     //     hotel_include_breakfast: 0,
//     //     only_x_left: {
//     //       microfunnel_rooms_list: { 1352801504: "We have 1 left" },
//     //       microfunnel_rate_selection: {},
//     //       rooms_list: { "1352801504_407605490_2_34_0_865575": "We have 1 left" },
//     //       room_page: { "1352801504_407605490_2_34_0_865575": "We have 1 left" },
//     //       post_select: { "1352801504_407605490_2_34_0_865575": "You selected the last room like this left on Booking.com!" },
//     //     },
//     //     average_room_size_for_ufi_m2: "419.59",
//     //     is_family_friendly: 0,
//     //     languages_spoken: { languagecode: ["ml", "kn", "hi", "en-gb"] },
//     //     host_profile: {
//     //       managed_properties_count: 1,
//     //       host_score_count: 15,
//     //       host_featured_reviews: [
//     //         {
//     //           pros: "Had a very good time here , the staff's were friendly and very helpful . The Place was very clean and well maintained. The location was also good , especially in the morning .",
//     //           author: { countrycode: "in", name: "Bhavish", type: "solo_traveller" },
//     //           title: "Very clean , beautiful and well maintained home stay with good staffs and service",
//     //           relative_time: { years_past: 0, days_past: 42, weeks_past: 6, months_past: 1 },
//     //           review_id: 5245273309,
//     //           average_score_out_of_10: 10,
//     //           travel_purpose: "business",
//     //           languagecode: "en-us",
//     //           id: 5245273309,
//     //           date: "2025-12-29 09:39:21",
//     //         },
//     //       ],
//     //       host_since: "Joined Booking.com on: Jan 31, 2025",
//     //       host_descriptions: [
//     //         { text: 1, title: "Years of experience on Booking.com:" },
//     //         { title: "Properties managed on Booking.com:", text: 1 },
//     //         { title: "Company info", text: "Welcome to our homestay! ..." },
//     //         { text: "Our homestay stands out...", title: "Property info" },
//     //         { text: "English, Hindi, Kannada, Malayalam", title: "Languages Spoken" },
//     //       ],
//     //       languages_spoken_by_hotelier: [
//     //         { lang_fe_code: "en-gb", lang_code: "en" },
//     //         { lang_fe_code: "hi", lang_code: "hi" },
//     //         { lang_code: "kn", lang_fe_code: "kn" },
//     //         { lang_code: "ml", lang_fe_code: "ml" },
//     //       ],
//     //       host_joined_booking: "2025-01-31",
//     //       host_score: 8.80000019073486,
//     //       photo_max500_url: "/xdata/images/xphoto/max500_ao/482563752.jpg?k=d605f0536e71a29dec6c328865ec1c7395130ddc2690a4b697404be8d54f374a&o=",
//     //       url_prefix: "https://cf.bstatic.com",
//     //       host_name: "Dream Garden Homestay",
//     //       host_is_pro: 1,
//     //     },
//     //     duplicate_rates_removed: 0,
//     //     hotel_name: "Dream Garden Homestay",
//     //     default_wishlist_name: "Madikeri",
//     //   },
//     // ];

//     // Ensure we target the first item in the array
//     const rawdata = response.data;
//     const data = rawdata[0];

//     const forui = {
//       // Accessing .rating from the object
//       wifi_review_score: data.wifi_review_score?.rating ?? null,

//       room_offers: data.block ?? [],
//       hotel_address: data.hotel_address_line ?? "",

//       // Correct paths for nested objects
//       min_room_distribution_adults: data.min_room_distribution?.adults ?? 0,
//       min_room_distribution_children: data.min_room_distribution?.children ?? [],

//       max_rooms_in_reservation: data.max_rooms_in_reservation ?? 0,
//       payment_method: data.payment_product ?? "",
//       timezone: data.timezone ?? "",
//       longitude: data.longitude ?? null,
//       latitude: data.latitude ?? null,

//       rooms: data.rooms ?? {},
//       room_recommendation: data.room_recommendation ?? [],
//       currency_code: data.currency_code ?? "INR",
//       top_ufi_benefits: data.top_ufi_benefits ?? [],
//       family_facilities: data.family_facilities ?? [],
//       hotel_name: data.hotel_name ?? "",

//       host: {
//         photo_max500_url: data.host_profile?.photo_max500_url ?? null,
//         url_prefix: data.host_profile?.url_prefix ?? null,
//         host_name: data.host_profile?.host_name ?? "",
//         host_score: data.host_profile?.host_score ?? null,
//         host_score_count: data.host_profile?.host_score_count ?? 0,
//         // Note: in your data it is 'languages_spoken_by_hotelier'
//         languages_spoken: data.host_profile?.languages_spoken_by_hotelier ?? [],
//         host_descriptions: data.host_profile?.host_descriptions ?? [],
//       },
//     };

//     console.log("Facilities for UI => ", JSON.stringify(forui, null, 2));
//     res.json(forui);

//     // res.json(response.data);
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to fetch hotel rooms" });
//   }
// });


router.get("/hotelpics", async (req, res) => {
  try {
    const { hotelid } = req.query;
    if (!hotelid) {
      return res.status(400).json({ error: "hotelid is required" });
    }
    const response = await axios.get(
      "https://apidojo-booking-v1.p.rapidapi.com/properties/get-hotel-photos",
      {
        params: {
          hotel_ids: hotelid,
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
        },
      }
    );
    const json = response.data;
    // const json = { "categories": [], "data": { "13528015": [[1, [{ "tag_id": 13, "tag_type": "ml_tags", "tag_name": "Bed", "photo_id": 796300599, "confidence": 100 }], 796300599, [{ "id": 13, "tag": "Bed" }, { "id": 199, "tag": "Bedroom" }, { "id": 1000000002, "tag": "Room" }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/796300599.jpg?k=538e7308ae5566888b8f208c4adab5ee437ab22917e781790f8b77ff076e3dbc&o=", "/xdata/images/hotel/max300/796300599.jpg?k=538e7308ae5566888b8f208c4adab5ee437ab22917e781790f8b77ff076e3dbc&o=", "/xdata/images/hotel/max500/796300599.jpg?k=538e7308ae5566888b8f208c4adab5ee437ab22917e781790f8b77ff076e3dbc&o=", "/xdata/images/hotel/square60/796300599.jpg?k=538e7308ae5566888b8f208c4adab5ee437ab22917e781790f8b77ff076e3dbc&o="], [1, [{ "tag_id": 13, "tag_type": "ml_tags", "tag_name": "Bed", "confidence": 100, "photo_id": 796301590 }], 796301590, [{ "tag": "Bedroom", "id": 199 }, { "id": 1000000001, "tag": "Property" }], "/xdata/images/hotel/max1024x768/796301590.jpg?k=51f43425d3c175098f093aa9fcc06e16a9c96f7b35712eccc197e52f6a462a3e&o=", "/xdata/images/hotel/max300/796301590.jpg?k=51f43425d3c175098f093aa9fcc06e16a9c96f7b35712eccc197e52f6a462a3e&o=", "/xdata/images/hotel/max500/796301590.jpg?k=51f43425d3c175098f093aa9fcc06e16a9c96f7b35712eccc197e52f6a462a3e&o=", "/xdata/images/hotel/square60/796301590.jpg?k=51f43425d3c175098f093aa9fcc06e16a9c96f7b35712eccc197e52f6a462a3e&o="], [1, [], 796302046, [{ "tag": "Property building", "id": 3 }, { "id": 1000000001, "tag": "Property" }], "/xdata/images/hotel/max1024x768/796302046.jpg?k=173f7434f4ce237faf85a0250539bf54b047879cfa844ab70df8b7d6ab515bef&o=", "/xdata/images/hotel/max300/796302046.jpg?k=173f7434f4ce237faf85a0250539bf54b047879cfa844ab70df8b7d6ab515bef&o=", "/xdata/images/hotel/max500/796302046.jpg?k=173f7434f4ce237faf85a0250539bf54b047879cfa844ab70df8b7d6ab515bef&o=", "/xdata/images/hotel/square60/796302046.jpg?k=173f7434f4ce237faf85a0250539bf54b047879cfa844ab70df8b7d6ab515bef&o="], [1, [], 796304048, [{ "tag": "Toilet", "id": 2 }, { "tag": "Bathroom", "id": 153 }, { "id": 1000000001, "tag": "Property" }], "/xdata/images/hotel/max1024x768/796304048.jpg?k=2e6d2a40dbd13b4c88e4cd736daeec029db4209aa0e89a529d562c6dd3e3f379&o=", "/xdata/images/hotel/max300/796304048.jpg?k=2e6d2a40dbd13b4c88e4cd736daeec029db4209aa0e89a529d562c6dd3e3f379&o=", "/xdata/images/hotel/max500/796304048.jpg?k=2e6d2a40dbd13b4c88e4cd736daeec029db4209aa0e89a529d562c6dd3e3f379&o=", "/xdata/images/hotel/square60/796304048.jpg?k=2e6d2a40dbd13b4c88e4cd736daeec029db4209aa0e89a529d562c6dd3e3f379&o="], [1, [], 796301214, [{ "tag": "Property building", "id": 3 }, { "id": 1000000001, "tag": "Property" }], "/xdata/images/hotel/max1024x768/796301214.jpg?k=8a370118d8298740b6076455f9a02fb4e40a915a1eaa870d35b2eb56c213966f&o=", "/xdata/images/hotel/max300/796301214.jpg?k=8a370118d8298740b6076455f9a02fb4e40a915a1eaa870d35b2eb56c213966f&o=", "/xdata/images/hotel/max500/796301214.jpg?k=8a370118d8298740b6076455f9a02fb4e40a915a1eaa870d35b2eb56c213966f&o=", "/xdata/images/hotel/square60/796301214.jpg?k=8a370118d8298740b6076455f9a02fb4e40a915a1eaa870d35b2eb56c213966f&o="], [1, [], 796302583, [{ "id": 241, "tag": "Meeting/conference room" }, { "id": 303, "tag": "fireplace" }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/796302583.jpg?k=0f0ed368d7f4fe40f6f6680088b1692e3747247a3eb2ee0818d4c1d73cecd3fd&o=", "/xdata/images/hotel/max300/796302583.jpg?k=0f0ed368d7f4fe40f6f6680088b1692e3747247a3eb2ee0818d4c1d73cecd3fd&o=", "/xdata/images/hotel/max500/796302583.jpg?k=0f0ed368d7f4fe40f6f6680088b1692e3747247a3eb2ee0818d4c1d73cecd3fd&o=", "/xdata/images/hotel/square60/796302583.jpg?k=0f0ed368d7f4fe40f6f6680088b1692e3747247a3eb2ee0818d4c1d73cecd3fd&o="], [1, [], 674197875, [{ "id": 252, "tag": "Mountain view" }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/674197875.jpg?k=f95e2b53a374526fa223df20394c61d147a5b89b0499b36d2a722b811185cffd&o=", "/xdata/images/hotel/max300/674197875.jpg?k=f95e2b53a374526fa223df20394c61d147a5b89b0499b36d2a722b811185cffd&o=", "/xdata/images/hotel/max500/674197875.jpg?k=f95e2b53a374526fa223df20394c61d147a5b89b0499b36d2a722b811185cffd&o=", "/xdata/images/hotel/square60/674197875.jpg?k=f95e2b53a374526fa223df20394c61d147a5b89b0499b36d2a722b811185cffd&o="], [1, [], 790164067, [{ "tag": "Toilet", "id": 2 }, { "tag": "Bathroom", "id": 153 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/790164067.jpg?k=a21215d93569e753c4bda1944c73e83203f6110e67f1309d78173b79e34f1f6c&o=", "/xdata/images/hotel/max300/790164067.jpg?k=a21215d93569e753c4bda1944c73e83203f6110e67f1309d78173b79e34f1f6c&o=", "/xdata/images/hotel/max500/790164067.jpg?k=a21215d93569e753c4bda1944c73e83203f6110e67f1309d78173b79e34f1f6c&o=", "/xdata/images/hotel/square60/790164067.jpg?k=a21215d93569e753c4bda1944c73e83203f6110e67f1309d78173b79e34f1f6c&o="], [1, [{ "tag_type": "ml_tags", "tag_name": "Bed", "tag_id": 13, "photo_id": 796304321, "confidence": 100 }], 796304321, [{ "tag": "Bed", "id": 13 }, { "id": 1000000002, "tag": "Room" }], "/xdata/images/hotel/max1024x768/796304321.jpg?k=61ff911f7186145371c0af936aaf0a72809e5472f806491910c5a513cd087f19&o=", "/xdata/images/hotel/max300/796304321.jpg?k=61ff911f7186145371c0af936aaf0a72809e5472f806491910c5a513cd087f19&o=", "/xdata/images/hotel/max500/796304321.jpg?k=61ff911f7186145371c0af936aaf0a72809e5472f806491910c5a513cd087f19&o=", "/xdata/images/hotel/square60/796304321.jpg?k=61ff911f7186145371c0af936aaf0a72809e5472f806491910c5a513cd087f19&o="], [1, [], 674200220, [{ "id": 194, "tag": "Evening entertainment" }, { "id": 1000000001, "tag": "Property" }], "/xdata/images/hotel/max1024x768/674200220.jpg?k=20e32207a5638da49e08aa0a8495c45b18a6dbf0602b6247bc3b3fe6814f9b7a&o=", "/xdata/images/hotel/max300/674200220.jpg?k=20e32207a5638da49e08aa0a8495c45b18a6dbf0602b6247bc3b3fe6814f9b7a&o=", "/xdata/images/hotel/max500/674200220.jpg?k=20e32207a5638da49e08aa0a8495c45b18a6dbf0602b6247bc3b3fe6814f9b7a&o=", "/xdata/images/hotel/square60/674200220.jpg?k=20e32207a5638da49e08aa0a8495c45b18a6dbf0602b6247bc3b3fe6814f9b7a&o="], [1, [], 674196747, [{ "id": 156, "tag": "View (from property/room)" }, { "tag": "Garden view", "id": 249 }, { "id": 1000000001, "tag": "Property" }], "/xdata/images/hotel/max1024x768/674196747.jpg?k=33ea1f02efc9efb6079f2acecf20d4118bc1bf8778a7e4d0aabd407e398232e7&o=", "/xdata/images/hotel/max300/674196747.jpg?k=33ea1f02efc9efb6079f2acecf20d4118bc1bf8778a7e4d0aabd407e398232e7&o=", "/xdata/images/hotel/max500/674196747.jpg?k=33ea1f02efc9efb6079f2acecf20d4118bc1bf8778a7e4d0aabd407e398232e7&o=", "/xdata/images/hotel/square60/674196747.jpg?k=33ea1f02efc9efb6079f2acecf20d4118bc1bf8778a7e4d0aabd407e398232e7&o="], [1, [], 665712952, [{ "id": 3, "tag": "Property building" }, { "tag": "Patio", "id": 4 }, { "tag": "Parking", "id": 296 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/665712952.jpg?k=5fed49554dda9d502a213f290644e734ca6487460fd9ccfc9cf150fd3b1b39a3&o=", "/xdata/images/hotel/max300/665712952.jpg?k=5fed49554dda9d502a213f290644e734ca6487460fd9ccfc9cf150fd3b1b39a3&o=", "/xdata/images/hotel/max500/665712952.jpg?k=5fed49554dda9d502a213f290644e734ca6487460fd9ccfc9cf150fd3b1b39a3&o=", "/xdata/images/hotel/square60/665712952.jpg?k=5fed49554dda9d502a213f290644e734ca6487460fd9ccfc9cf150fd3b1b39a3&o="], [1, [], 643037728, [{ "tag": "Parking", "id": 296 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/643037728.jpg?k=9981f46987f58f0a3c29c7e348938b9f76c9c8a3caaca006ff274d3c9503c699&o=", "/xdata/images/hotel/max300/643037728.jpg?k=9981f46987f58f0a3c29c7e348938b9f76c9c8a3caaca006ff274d3c9503c699&o=", "/xdata/images/hotel/max500/643037728.jpg?k=9981f46987f58f0a3c29c7e348938b9f76c9c8a3caaca006ff274d3c9503c699&o=", "/xdata/images/hotel/square60/643037728.jpg?k=9981f46987f58f0a3c29c7e348938b9f76c9c8a3caaca006ff274d3c9503c699&o="], [1, [], 665712445, [{ "tag": "Day", "id": 41 }, { "tag": "Garden", "id": 103 }, { "tag": "Garden view", "id": 249 }, { "tag": "Sunset", "id": 280 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/665712445.jpg?k=341c4b0749963c2ddfe1b5da40f816954da2a9278ca93c82523a5fd342748f96&o=", "/xdata/images/hotel/max300/665712445.jpg?k=341c4b0749963c2ddfe1b5da40f816954da2a9278ca93c82523a5fd342748f96&o=", "/xdata/images/hotel/max500/665712445.jpg?k=341c4b0749963c2ddfe1b5da40f816954da2a9278ca93c82523a5fd342748f96&o=", "/xdata/images/hotel/square60/665712445.jpg?k=341c4b0749963c2ddfe1b5da40f816954da2a9278ca93c82523a5fd342748f96&o="], [1, [], 665713003, [{ "tag": "Balcony/Terrace", "id": 157 }, { "id": 1000000001, "tag": "Property" }], "/xdata/images/hotel/max1024x768/665713003.jpg?k=af23ec01adc59ac98ff268e608f22ee4e1a1bf19760219179b98e66bb923642b&o=", "/xdata/images/hotel/max300/665713003.jpg?k=af23ec01adc59ac98ff268e608f22ee4e1a1bf19760219179b98e66bb923642b&o=", "/xdata/images/hotel/max500/665713003.jpg?k=af23ec01adc59ac98ff268e608f22ee4e1a1bf19760219179b98e66bb923642b&o=", "/xdata/images/hotel/square60/665713003.jpg?k=af23ec01adc59ac98ff268e608f22ee4e1a1bf19760219179b98e66bb923642b&o="], [1, [{ "tag_id": 13, "tag_name": "Bed", "tag_type": "ml_tags", "confidence": 100, "photo_id": 674178926 }], 674178926, [{ "tag": "Decorative detail", "id": 179 }], "/xdata/images/hotel/max1024x768/674178926.jpg?k=ebab800096cca1a9da94bec490ff0d451e79562c7fa7c37a395b92431020c71a&o=", "/xdata/images/hotel/max300/674178926.jpg?k=ebab800096cca1a9da94bec490ff0d451e79562c7fa7c37a395b92431020c71a&o=", "/xdata/images/hotel/max500/674178926.jpg?k=ebab800096cca1a9da94bec490ff0d451e79562c7fa7c37a395b92431020c71a&o=", "/xdata/images/hotel/square60/674178926.jpg?k=ebab800096cca1a9da94bec490ff0d451e79562c7fa7c37a395b92431020c71a&o="], [1, [], 665718113, [{ "tag": "Garden", "id": 103 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/665718113.jpg?k=5e8cfe97952cddf89c5326d23df0c01210e1baf115a618b1b10a048d708ab881&o=", "/xdata/images/hotel/max300/665718113.jpg?k=5e8cfe97952cddf89c5326d23df0c01210e1baf115a618b1b10a048d708ab881&o=", "/xdata/images/hotel/max500/665718113.jpg?k=5e8cfe97952cddf89c5326d23df0c01210e1baf115a618b1b10a048d708ab881&o=", "/xdata/images/hotel/square60/665718113.jpg?k=5e8cfe97952cddf89c5326d23df0c01210e1baf115a618b1b10a048d708ab881&o="], [1, [], 665718759, [{ "id": 103, "tag": "Garden" }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/665718759.jpg?k=9ba180565606563e9b07cbd4d1413643f90f51f84d1f4fca9fe43cd7f12b4ae1&o=", "/xdata/images/hotel/max300/665718759.jpg?k=9ba180565606563e9b07cbd4d1413643f90f51f84d1f4fca9fe43cd7f12b4ae1&o=", "/xdata/images/hotel/max500/665718759.jpg?k=9ba180565606563e9b07cbd4d1413643f90f51f84d1f4fca9fe43cd7f12b4ae1&o=", "/xdata/images/hotel/square60/665718759.jpg?k=9ba180565606563e9b07cbd4d1413643f90f51f84d1f4fca9fe43cd7f12b4ae1&o="], [1, [], 789541357, [{ "tag": "Property building", "id": 3 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/789541357.jpg?k=dc1d731b7caf578751f03fb048ecfd9c1dcb930a36b7f35418639727edc6589e&o=", "/xdata/images/hotel/max300/789541357.jpg?k=dc1d731b7caf578751f03fb048ecfd9c1dcb930a36b7f35418639727edc6589e&o=", "/xdata/images/hotel/max500/789541357.jpg?k=dc1d731b7caf578751f03fb048ecfd9c1dcb930a36b7f35418639727edc6589e&o=", "/xdata/images/hotel/square60/789541357.jpg?k=dc1d731b7caf578751f03fb048ecfd9c1dcb930a36b7f35418639727edc6589e&o="], [1, [{ "photo_id": 796301094, "confidence": 100, "tag_name": "Bed", "tag_type": "ml_tags", "tag_id": 13 }], 796301094, [{ "tag": "Bedroom", "id": 199 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/796301094.jpg?k=e2a2c0a898460d67105fe5beb797023bd1fe2d0f61f157bc2d9051f5737c74e0&o=", "/xdata/images/hotel/max300/796301094.jpg?k=e2a2c0a898460d67105fe5beb797023bd1fe2d0f61f157bc2d9051f5737c74e0&o=", "/xdata/images/hotel/max500/796301094.jpg?k=e2a2c0a898460d67105fe5beb797023bd1fe2d0f61f157bc2d9051f5737c74e0&o=", "/xdata/images/hotel/square60/796301094.jpg?k=e2a2c0a898460d67105fe5beb797023bd1fe2d0f61f157bc2d9051f5737c74e0&o="], [1, [], 796306145, [], "/xdata/images/hotel/max1024x768/796306145.jpg?k=cee891834ba69045bbd055bd693a5d8c3d44fceedc34d3a002cee718574bd2be&o=", "/xdata/images/hotel/max300/796306145.jpg?k=cee891834ba69045bbd055bd693a5d8c3d44fceedc34d3a002cee718574bd2be&o=", "/xdata/images/hotel/max500/796306145.jpg?k=cee891834ba69045bbd055bd693a5d8c3d44fceedc34d3a002cee718574bd2be&o=", "/xdata/images/hotel/square60/796306145.jpg?k=cee891834ba69045bbd055bd693a5d8c3d44fceedc34d3a002cee718574bd2be&o="], [1, [], 687060905, [{ "tag": "Dinner", "id": 272 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/687060905.jpg?k=5dd61718fde300f4437a29185c1f2c9b29fb6554c3da9e2ee2751fe849ef26f8&o=", "/xdata/images/hotel/max300/687060905.jpg?k=5dd61718fde300f4437a29185c1f2c9b29fb6554c3da9e2ee2751fe849ef26f8&o=", "/xdata/images/hotel/max500/687060905.jpg?k=5dd61718fde300f4437a29185c1f2c9b29fb6554c3da9e2ee2751fe849ef26f8&o=", "/xdata/images/hotel/square60/687060905.jpg?k=5dd61718fde300f4437a29185c1f2c9b29fb6554c3da9e2ee2751fe849ef26f8&o="], [1, [], 796301050, [{ "id": 153, "tag": "Bathroom" }, { "id": 1000000001, "tag": "Property" }], "/xdata/images/hotel/max1024x768/796301050.jpg?k=37e5aa526de9e26995f2d2d15232060acae51fc6bcaa7a354b245e0c7a3966a3&o=", "/xdata/images/hotel/max300/796301050.jpg?k=37e5aa526de9e26995f2d2d15232060acae51fc6bcaa7a354b245e0c7a3966a3&o=", "/xdata/images/hotel/max500/796301050.jpg?k=37e5aa526de9e26995f2d2d15232060acae51fc6bcaa7a354b245e0c7a3966a3&o=", "/xdata/images/hotel/square60/796301050.jpg?k=37e5aa526de9e26995f2d2d15232060acae51fc6bcaa7a354b245e0c7a3966a3&o="], [1, [{ "tag_type": "ml_tags", "tag_name": "Bed", "tag_id": 13, "photo_id": 796800579, "confidence": 100 }], 796800579, [{ "tag": "Bedroom", "id": 199 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/796800579.jpg?k=54b76fecd24508337fd3d4d40203c14a5d9edad5233b957f61ef755d46fea060&o=", "/xdata/images/hotel/max300/796800579.jpg?k=54b76fecd24508337fd3d4d40203c14a5d9edad5233b957f61ef755d46fea060&o=", "/xdata/images/hotel/max500/796800579.jpg?k=54b76fecd24508337fd3d4d40203c14a5d9edad5233b957f61ef755d46fea060&o=", "/xdata/images/hotel/square60/796800579.jpg?k=54b76fecd24508337fd3d4d40203c14a5d9edad5233b957f61ef755d46fea060&o="], [1, [{ "tag_id": 13, "tag_name": "Bed", "tag_type": "ml_tags", "confidence": 100, "photo_id": 643039707 }], 643039707, [{ "id": 13, "tag": "Bed" }, { "id": 1000000002, "tag": "Room" }], "/xdata/images/hotel/max1024x768/643039707.jpg?k=b728f350032a0ed2ff484961d19fb1bab11b047e33b8218e5b9e65acef676fcb&o=", "/xdata/images/hotel/max300/643039707.jpg?k=b728f350032a0ed2ff484961d19fb1bab11b047e33b8218e5b9e65acef676fcb&o=", "/xdata/images/hotel/max500/643039707.jpg?k=b728f350032a0ed2ff484961d19fb1bab11b047e33b8218e5b9e65acef676fcb&o=", "/xdata/images/hotel/square60/643039707.jpg?k=b728f350032a0ed2ff484961d19fb1bab11b047e33b8218e5b9e65acef676fcb&o="], [1, [], 796801864, [{ "tag": "Toilet", "id": 2 }, { "tag": "Property", "id": 1000000001 }], "/xdata/images/hotel/max1024x768/796801864.jpg?k=38e4cb043fae35971b338636d9e64ef9f275605a41ac8e60a757de02e8b084e4&o=", "/xdata/images/hotel/max300/796801864.jpg?k=38e4cb043fae35971b338636d9e64ef9f275605a41ac8e60a757de02e8b084e4&o=", "/xdata/images/hotel/max500/796801864.jpg?k=38e4cb043fae35971b338636d9e64ef9f275605a41ac8e60a757de02e8b084e4&o=", "/xdata/images/hotel/square60/796801864.jpg?k=38e4cb043fae35971b338636d9e64ef9f275605a41ac8e60a757de02e8b084e4&o="]] }, "url_prefix": "https://cf.bstatic.com" }
    const hotelId = String(hotelid); // e.g. "13528015"

    const photosArray = json.data?.[hotelId] || [];
    const prefix = json.url_prefix || "";

    const images = photosArray.map((p) => ({
      max500: prefix + p[6],
      max300: prefix + p[5],
      square: prefix + p[7],
      photo_id: p[0],
    }));
    console.log("Raw hotel photos data:", JSON.stringify(images, null, 2));
    console.log("Parsed hotel images:", images.length);

    // Send CLEAN data to frontend
    res.json({
      hotelId: hotelId,
      images,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch hotel photos" });
  };
});

module.exports = router;
