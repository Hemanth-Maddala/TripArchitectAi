import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, useLocalSearchParams } from "expo-router";
import { use, useEffect } from "react";

export default function Hotels() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const { hotelsData, destinationState, destinationInput } = params;

  let parsedHotels: any[] = hotelsData
    ? JSON.parse(hotelsData as string)
    : [];

  const destinationLabel =
    (destinationInput as string) ||
    (destinationState as string) ||
    "your destination";

  const hasHotels = parsedHotels && parsedHotels.length > 0;

  const gethotel = (hotel_id: number) => {
    const selectedHotel = parsedHotels.find(
      (hotel) => hotel.id === hotel_id
    );
    console.log("Selected hotel for details:", selectedHotel);
    router.push({
      pathname: "/tabs/hotel_details",
      params: {
        hotel_id: hotel_id.toString(),
        destinationInput: destinationInput,
        hotelsData: JSON.stringify(selectedHotel) || "[]",
      },
    });
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-100">
        <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#0f766e" />
          </TouchableOpacity>
          <Text className="text-2xl font-Lobster text-teal-900">
            <Ionicons name="sparkles" size={22} color="#f59e0b" />
            Hotels & Stays
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
        <View className="px-4 pb-3">
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="#14b8a6" />
            <Text className="text-sm text-slate-600 ml-2 font-medium">
              {destinationInput || destinationState || "your destination"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
      >

        {/* Hotels list */}
        {hasHotels ? (
          parsedHotels.map((hotel: any, index: number) => {
            return (
              <TouchableOpacity
                key={hotel.id ?? index}
                className="mx-4 mb-4 bg-white rounded-2xl p-3"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 4,
                }}
                activeOpacity={0.7}
                onPress={() => gethotel(hotel.id)}
              >
                <View className="flex-row">
                  {/* Image */}
                  {hotel.image ? (
                    <Image
                      source={{ uri: hotel.image }}
                      className="w-28 h-28 rounded-2xl mr-3 bg-slate-200"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-28 h-28 rounded-2xl mr-3 bg-slate-200 items-center justify-center">
                      <Ionicons name="bed" size={24} color="#0f766e" />
                    </View>
                  )}

                  {/* Content */}
                  <View className="flex-1">
                    {/* Top row: name + price */}
                    <View className="flex-row justify-between items-start mb-1.5">
                      <View className="flex-1 mr-2">
                        <Text
                          className="text-base font-semibold text-pink-900"
                          numberOfLines={2}
                        >
                          {hotel.name ? hotel.name : "Unnamed Hotel"}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color="#0f766e"
                          />
                          <Text
                            className="text-xs font-semibold text-slate-600 ml-1"
                            numberOfLines={1}
                          >
                            {hotel.city ? hotel.city : destinationInput} • {hotel.type || "Hotel"}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-lg font-extrabold text-teal-900">
                          ₹{hotel.price || "N/A"}
                        </Text>
                        <Text className="text-[11px] text-slate-500">
                          {(hotel.currency as string) || "INR"}  • per night
                        </Text>
                      </View>
                    </View>

                    {/* Rating + tags */}
                    <View className="flex-row justify-between items-center mt-1">
                      <View className="flex-row items-center">
                        <View className="flex-row items-center px-2 py-1 rounded-full bg-amber-50 border border-amber-100">
                          <Ionicons name="star" size={12} color="#f59e0b" />
                          <Text className="text-[11px] text-amber-800 ml-1">
                            {hotel.rating
                              ? `${hotel.rating} ${hotel.ratingText}`
                              : "New listing"}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row gap-2">
                        <View className="px-2 py-1 rounded-full bg-sky-50 border border-sky-200">
                          <Text className="text-[11px] text-sky-700 font-semibold">
                            {hotel.type || "Hotel"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="mx-4 mt-4">
            <Text className="text-sm text-slate-600">
              We are fetching the best hotel options for your trip. Please try again
              in a moment.
            </Text>
          </View>
        )}
        {/* Summary card */}
        <View className="mx-4 mb-4 p-4 rounded-2xl bg-teal-50 border border-teal-100">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-xl bg-white items-center justify-center mr-3">
              <Ionicons name="bed" size={22} color="#D81B60" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-teal-900">
                {hasHotels
                  ? `${parsedHotels.length} great stays found`
                  : "Finding the best stays for you"}
              </Text>
              <Text className="text-xs text-teal-800 mt-0.5">
                Curated options for your trip to {destinationLabel}.
              </Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-1">
            <View className="px-2 py-1 rounded-full bg-white/80 border border-green-100">
              <Text className="text-[11px] text-green-800 font-semibold">
                Budget friendly
              </Text>
            </View>
            <View className="px-2 py-1 rounded-full bg-white/80 border border-blue-100">
              <Text className="text-[11px] text-blue-800 font-semibold">
                Great reviews
              </Text>
            </View>
            <View className="px-2 py-1 rounded-full bg-white/80 border border-yellow-100">
              <Text className="text-[11px] text-yellow-800 font-semibold">
                Near attractions
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}