import { Text, View, ScrollView, TouchableOpacity, Image, ToastAndroid } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useMemo, use } from "react";
import { Ionicons } from "@expo/vector-icons";
export default function Hotels() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [hotelfacilities, setHotelfacilities] = useState<any>({});
  const [hotelphotos, setHotelphotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { hotel_id, destinationState, destinationInput, hotelsData } = params;
  let hotelselected: any = hotelsData ? JSON.parse(hotelsData as string) : {};

  useEffect(() => {
    if (!hotel_id) return;

    setLoading(true);

    const fetchHotelfacilities = async () => {
      try {
        setLoading(true);

        if (!hotel_id) {
          console.log("Hotel ID missing");
          return;
        }

        const response = await fetch(
          `https://triparchitectai.onrender.com/api/hoteldetails/hotelfacilities?hotelid=${encodeURIComponent(
            String(hotel_id)
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch hotel facilities");
        }

        let data;
        try {
          data = await response.json();
        } catch (err) {
          throw new Error("Invalid JSON response");
        }

        console.log("Backend response:", data);

        const facilities = data?.facilitie
        if (!Array.isArray(facilities)) {
          console.log("Facilities is not an array");
          return;
        }
        const grouped = facilities.reduce((acc, item) => {
          const category = item?.facilitytype_name || "Other";

          if (!acc[category]) acc[category] = [];

          acc[category].push(item);
          return acc;
        }, {});

        setHotelfacilities(grouped);

      } catch (error) {
        console.error("Error fetching facilities:", error);

        ToastAndroid.show(
          "Unable to load facilities. Try again.",
          ToastAndroid.SHORT
        );

      } finally {
        setLoading(false);
      }
    };
    fetchHotelfacilities();

    const fetchphotos = async () => {
      try {
        if (!hotel_id) {
          console.log("Hotel ID missing");
          setHotelphotos([]);
          return;
        }

        const response = await fetch(
          `https://triparchitectai.onrender.com/api/hoteldetails/hotelpics?hotelid=${encodeURIComponent(
            String(hotel_id)
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch hotel photos");
        }

        let data;

        try {
          data = await response.json();
        } catch (err) {
          throw new Error("Invalid JSON response");
        }
        const images = Array.isArray(data?.images) ? data.images : [];

        setHotelphotos(images);

      } catch (error) {
        console.error("Error fetching hotel photos:", error);
        ToastAndroid.show(
          "Unable to load photos. Try again.",
          ToastAndroid.SHORT
        );

        setHotelphotos([]);
      }
    };

    fetchphotos();


    // const facilities = [
    //   {
    //     hotelfacilitytype_id: 5,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Services',
    //     is_common_room_facility: 0,
    //     value: 1,
    //     facilitytype_id: 3,
    //     kind: 'boolean',
    //     facility_name: 'Room service',
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Outdoors',
    //     hotelfacilitytype_id: 14,
    //     facilitytype_id: 13,
    //     value: 1,
    //     is_common_room_facility: 0,
    //     kind: 'boolean',
    //     facility_name: 'Garden',
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     facility_name: 'Terrace',
    //     roomfacilitytype_id: '',
    //     hotelfacilitytype_id: 15,
    //     facilitytype_name: 'Outdoors',
    //     hotel_id: 13528015,
    //     is_common_room_facility: 0,
    //     value: 1,
    //     facilitytype_id: 13,
    //     kind: 'boolean'
    //   },
    //   {
    //     kind: 'boolean',
    //     value: 1,
    //     facilitytype_id: 1,
    //     is_common_room_facility: 0,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'General',
    //     hotelfacilitytype_id: 16,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Non-smoking rooms'
    //   },
    //   {
    //     is_common_room_facility: 0,
    //     facilitytype_id: 1,
    //     value: 1,
    //     hotelfacilitytype_id: 28,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'General',
    //     kind: 'boolean',
    //     facility_name: 'Family rooms',
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     roomfacilitytype_id: '',
    //     facility_name: 'Breakfast in the room',
    //     kind: 'boolean',
    //     hotelfacilitytype_id: 43,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Food & Drink',
    //     is_common_room_facility: 0,
    //     value: 1,
    //     facilitytype_id: 7
    //   },
    //   {
    //     is_common_room_facility: 0,
    //     value: 5,
    //     facilitytype_id: 2,
    //     hotelfacilitytype_id: 59,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Activities',
    //     kind: 'free_or_paid',
    //     facility_name: 'Karaoke (additional charge)',
    //     roomfacilitytype_id: '',
    //     paid: 1
    //   },
    //   {
    //     kind: 'boolean',
    //     hotel_id: 13528015,
    //     facilitytype_name: 'General',
    //     hotelfacilitytype_id: 64,
    //     value: 1,
    //     facilitytype_id: 1,
    //     is_common_room_facility: 0,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Soundproof rooms'
    //   },
    //   {
    //     kind: 'free_or_paid',
    //     free: 1,
    //     is_common_room_facility: 0,
    //     value: 4,
    //     facilitytype_id: 2,
    //     hotelfacilitytype_id: 70,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Activities',
    //     roomfacilitytype_id: '',
    //     facility_name: 'Hiking'
    //   },
    //   {
    //     is_common_room_facility: 0,
    //     facilitytype_id: 3,
    //     value: 1,
    //     hotelfacilitytype_id: 73,
    //     facilitytype_name: 'Services',
    //     hotel_id: 13528015,
    //     kind: 'boolean',
    //     facility_name: 'Packed lunches',
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     facility_name: 'Baggage storage',
    //     roomfacilitytype_id: '',
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Services',
    //     hotelfacilitytype_id: 91,
    //     facilitytype_id: 3,
    //     value: 4,
    //     is_common_room_facility: 0,
    //     free: 1,
    //     kind: 'free_or_paid'
    //   },
    //   {
    //     kind: 'boolean',
    //     facilitytype_id: 1,
    //     value: 1,
    //     is_common_room_facility: 0,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'General',
    //     hotelfacilitytype_id: 101,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Hypoallergenic room available'
    //   },
    //   {
    //     facilitytype_name: 'Outdoors',
    //     hotel_id: 13528015,
    //     hotelfacilitytype_id: 118,
    //     value: 1,
    //     facilitytype_id: 13,
    //     is_common_room_facility: 0,
    //     kind: 'boolean',
    //     facility_name: 'Sun deck',
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     hotelfacilitytype_id: 127,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Services',
    //     is_common_room_facility: 0,
    //     value: 1,
    //     facilitytype_id: 3,
    //     kind: 'boolean',
    //     facility_name: 'Private check-in/out',
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     roomfacilitytype_id: '',
    //     facility_name: 'Shared kitchen',
    //     kind: 'boolean',
    //     facilitytype_id: 12,
    //     value: 1,
    //     is_common_room_facility: 0,
    //     facilitytype_name: 'Kitchen',
    //     hotel_id: 13528015,
    //     hotelfacilitytype_id: 141
    //   },
    //   {
    //     kind: 'boolean',
    //     facilitytype_id: 3,
    //     value: 1,
    //     is_common_room_facility: 0,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Services',
    //     hotelfacilitytype_id: 142,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Lockers'
    //   },
    //   {
    //     hotelfacilitytype_id: 143,
    //     facilitytype_name: 'Services',
    //     hotel_id: 13528015,
    //     is_common_room_facility: 0,
    //     value: 1,
    //     facilitytype_id: 3,
    //     kind: 'boolean',
    //     facility_name: 'Shared lounge/TV area',
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     hotelfacilitytype_id: 147,
    //     facilitytype_name: 'Activities',
    //     hotel_id: 13528015,
    //     is_common_room_facility: 0,
    //     value: 5,
    //     facilitytype_id: 2,
    //     kind: 'free_or_paid',
    //     facility_name: 'Evening entertainment (additional charge)',
    //     paid: 1,
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     free: 1,
    //     is_common_room_facility: 0,
    //     value: 4,
    //     facilitytype_id: 3,
    //     hotelfacilitytype_id: 158,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Services',
    //     kind: 'free_or_paid',
    //     facility_name: 'Daily housekeeping',
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     facility_name: 'Grocery deliveries (additional charge)',
    //     paid: 1,
    //     roomfacilitytype_id: '',
    //     facilitytype_name: 'Services',
    //     hotel_id: 13528015,
    //     hotelfacilitytype_id: 159,
    //     facilitytype_id: 3,
    //     value: 5,
    //     is_common_room_facility: 0,
    //     kind: 'free_or_paid'
    //   },
    //   {
    //     kind: 'boolean',
    //     is_common_room_facility: 0,
    //     value: 1,
    //     facilitytype_id: 16,
    //     hotelfacilitytype_id: 184,
    //     facilitytype_name: 'Parking',
    //     hotel_id: 13528015,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Accessible parking'
    //   },
    //   {
    //     kind: 'boolean',
    //     hotelfacilitytype_id: 224,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Outdoors',
    //     is_common_room_facility: 0,
    //     value: 1,
    //     facilitytype_id: 13,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Picnic area'
    //   },
    //   {
    //     is_common_room_facility: 0,
    //     value: 1,
    //     facilitytype_id: 13,
    //     hotelfacilitytype_id: 225,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Outdoors',
    //     kind: 'boolean',
    //     facility_name: 'Outdoor fireplace',
    //     roomfacilitytype_id: ''
    //   },
    //   {
    //     kind: 'free_or_paid',
    //     hotelfacilitytype_id: 406,
    //     facilitytype_name: 'Activities',
    //     hotel_id: 13528015,
    //     is_common_room_facility: 0,
    //     facilitytype_id: 2,
    //     value: 5,
    //     paid: 1,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Themed dinners (additional charge)'
    //   },
    //   {
    //     roomfacilitytype_id: '',
    //     paid: 1,
    //     facility_name: 'Happy hour (additional charge)',
    //     kind: 'free_or_paid',
    //     is_common_room_facility: 0,
    //     value: 5,
    //     facilitytype_id: 2,
    //     hotelfacilitytype_id: 407,
    //     facilitytype_name: 'Activities',
    //     hotel_id: 13528015
    //   },
    //   {
    //     facility_name: 'Live music/Performance (additional charge)',
    //     paid: 1,
    //     roomfacilitytype_id: '',
    //     hotelfacilitytype_id: 410,
    //     facilitytype_name: 'Activities',
    //     hotel_id: 13528015,
    //     is_common_room_facility: 0,
    //     facilitytype_id: 2,
    //     value: 5,
    //     kind: 'free_or_paid'
    //   },
    //   {
    //     facility_name: '24-hour security',
    //     roomfacilitytype_id: '',
    //     hotelfacilitytype_id: 418,
    //     facilitytype_name: 'Miscellaneous',
    //     hotel_id: 13528015,
    //     is_common_room_facility: 0,
    //     facilitytype_id: 29,
    //     value: 1,
    //     kind: 'boolean'
    //   },
    //   {
    //     roomfacilitytype_id: '',
    //     facility_name: 'Key access',
    //     kind: 'boolean',
    //     value: 1,
    //     facilitytype_id: 29,
    //     is_common_room_facility: 0,
    //     facilitytype_name: 'Miscellaneous',
    //     hotel_id: 13528015,
    //     hotelfacilitytype_id: 419
    //   },
    //   {
    //     kind: 'boolean',
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Miscellaneous',
    //     hotelfacilitytype_id: 421,
    //     value: 1,
    //     facilitytype_id: 29,
    //     is_common_room_facility: 0,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Security alarm'
    //   },
    //   {
    //     roomfacilitytype_id: '',
    //     facility_name: 'CCTV in common areas',
    //     kind: 'boolean',
    //     is_common_room_facility: 0,
    //     facilitytype_id: 29,
    //     value: 1,
    //     hotelfacilitytype_id: 423,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Miscellaneous'
    //   },
    //   {
    //     roomfacilitytype_id: '',
    //     facility_name: 'CCTV outside property',
    //     kind: 'boolean',
    //     facilitytype_name: 'Miscellaneous',
    //     hotel_id: 13528015,
    //     hotelfacilitytype_id: 424,
    //     value: 1,
    //     facilitytype_id: 29,
    //     is_common_room_facility: 0
    //   },
    //   {
    //     kind: 'boolean',
    //     facilitytype_id: 29,
    //     value: 1,
    //     is_common_room_facility: 0,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Miscellaneous',
    //     hotelfacilitytype_id: 425,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Fire extinguishers'
    //   },
    //   {
    //     kind: 'boolean',
    //     facilitytype_name: 'Miscellaneous',
    //     hotel_id: 13528015,
    //     hotelfacilitytype_id: 484,
    //     value: 1,
    //     facilitytype_id: 29,
    //     is_common_room_facility: 0,
    //     roomfacilitytype_id: '',
    //     facility_name: 'Breakfast to-go containers'
    //   },
    //   {
    //     roomfacilitytype_id: '',
    //     facility_name: 'Delivered food covered securely',
    //     kind: 'boolean',
    //     hotelfacilitytype_id: 485,
    //     hotel_id: 13528015,
    //     facilitytype_name: 'Miscellaneous',
    //     is_common_room_facility: 0,
    //     value: 1,
    //     facilitytype_id: 29
    //   }
    // ];
    // console.log("Facilities data:", facilities.length);

  }, [hotel_id]);

  useEffect(() => {
    console.log(hotelphotos);
  }, [hotelphotos]);

  useEffect(() => {
    if (!hotel_id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        if (!hotel_id) {
          console.log("Hotel ID missing");
          setHotelfacilities({});
          setHotelphotos([]);
          return;
        }

        const BASE_URL = "https://triparchitectai.onrender.com";

        const [facilitiesRes, photosRes] = await Promise.all([
          fetch(
            `${BASE_URL}/api/hoteldetails/hotelfacilities?hotelid=${encodeURIComponent(
              String(hotel_id)
            )}`
          ),
          fetch(
            `${BASE_URL}/api/hoteldetails/hotelpics?hotelid=${encodeURIComponent(
              String(hotel_id)
            )}`
          ),
        ]);

        if (!facilitiesRes.ok) throw new Error("Facilities failed");
        if (!photosRes.ok) throw new Error("Photos failed");
        let facilitiesData, photosData;

        try {
          facilitiesData = await facilitiesRes.json();
          photosData = await photosRes.json();
        } catch (err) {
          throw new Error("Invalid JSON response");
        }

        // ================= FACILITIES =================
        let facilitiesArray = [];

        if (Array.isArray(facilitiesData)) {
          facilitiesArray = facilitiesData;
        } else if (Array.isArray(facilitiesData?.facilities)) {
          facilitiesArray = facilitiesData.facilities;
        } else if (facilitiesData && typeof facilitiesData === "object") {
          facilitiesArray = [facilitiesData];
        }

        if (!Array.isArray(facilitiesArray)) facilitiesArray = [];

        const grouped = facilitiesArray.reduce((acc, item) => {
          const category = item?.facilitytype_name || "Other";

          if (!acc[category]) acc[category] = [];
          acc[category].push(item);

          return acc;
        }, {});

        setHotelfacilities(grouped);

        // ================= PHOTOS =================
        const images = Array.isArray(photosData?.images)
          ? photosData.images
          : [];

        setHotelphotos(images);

      } catch (error) {
        console.error("Hotel details error:", error);
        ToastAndroid.show(
          "Failed to load hotel details. Try again.",
          ToastAndroid.SHORT
        );

        setHotelfacilities({});
        setHotelphotos([]);

      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [hotel_id]);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 flex-row items-center justify-between border-b border-slate-50">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-slate-50 rounded-full">
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-2xl font-Lobster text-teal-900">
          <Ionicons name="sparkles" size={22} color="#f59e0b" />
          Hotel Details
        </Text>
        <TouchableOpacity onPress={() => router.navigate("/tabs/profile")}>
          <Image
            source={require("../../assets/images/boy.png")}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
            style={{
              borderWidth: 4,
              borderColor: "#ffffff",
            }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Title Section */}
        <View className="px-6 py-5">
          <Text className="text-2xl font-Lobster text-pink-900 tracking-tight">
            {hotelselected?.name || "Hotel Name"}
          </Text>
          <View className="bg-teal-50 rounded-2xl px-4 py-3 mt-3 border border-teal-100">
            <View className="flex-row items-center mb-1.5">
              <Ionicons name="information-circle" size={18} color="#0f766e" />
              <Text className="text-sm font-semibold text-teal-900 ml-2 flex-1">
                Facilities and Animities provided by <Text className="font-Lobster text-pink-900">{hotelselected?.name || "the hotel"}</Text>
              </Text>
            </View>
            <View className="self-start px-2 py-1 rounded-full bg-white/80 border border-blue-100">
              <Text className="text-[11px] text-blue-800 font-semibold">
                Approved by Travel , Booking.com
              </Text>
            </View>

          </View>
        </View>

        {loading ? (
          <View className="p-20 items-center">
            <Text className="text-slate-400">Curating your hotel story...</Text>
          </View>
        ) : (
          Object.keys(hotelfacilities || {}).map((category, index) => {
            const facilitiesForCategory = hotelfacilities[category] || [];

            const imageCount = 2;
            const totalPhotos = hotelphotos.length;
            const safeLength = totalPhotos === 0 ? 0 : Math.max(totalPhotos, imageCount);
            const startIdx = safeLength ? (index * imageCount) % safeLength : 0;
            const displayPhotos =
              safeLength === 0
                ? []
                : new Array(imageCount)
                  .fill(null)
                  .map((_, i) => hotelphotos[(startIdx + i) % safeLength])
                  .filter(Boolean);

            return (
              <View key={category} className="px-4 mb-6">
                {/* Outer box for this category */}
                <View className="bg-slate-50 rounded-3xl p-4 border border-slate-100">
                  {/* Category Header */}
                  <View className="mb-3 flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2px]">
                        CATEGORY
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="star" size={20} color="#f59e0b" />
                        <Text className="mt-1 text-2xl font-Lobster text-cyan-900">
                          {category}
                        </Text>
                      </View>
                    </View>
                    <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      <Text className="text-[11px] font-semibold text-blue-700">
                        {facilitiesForCategory.length} options
                      </Text>
                    </View>
                  </View>

                  {/* Images row with reserved space */}
                  {displayPhotos.length > 0 && (
                    <View className="mb-4">
                      <View className="flex-row gap-2 h-36">
                        {displayPhotos.map((photo: any, photoIndex: number) => (
                          <View
                            key={photoIndex}
                            className="flex-1 rounded-2xl overflow-hidden bg-slate-100 shadow-sm shadow-slate-200"
                          >
                            <Image
                              source={{ uri: photo?.max500 || photo?.max300 }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Inner box just for facilities */}
                  <View className="bg-white rounded-2xl px-3 py-3 border border-slate-100">
                    <View className="flex-row flex-wrap">
                      {facilitiesForCategory.map((item: any, chipIndex: number) => (
                        <View
                          key={`${item.hotelfacilitytype_id}-${chipIndex}`}
                          className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 mr-2 mb-2 flex-row items-center"
                        >
                          <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                          <Text className="ml-2 text-teal-900 font-bold text-xs">
                            {item.facility_name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

