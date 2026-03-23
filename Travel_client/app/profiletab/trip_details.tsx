import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useMemo } from "react";

const BASE_URL = "http://172.25.0.52:3000";

export default function TripDetailsScreen() {
  const params = useLocalSearchParams();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ SAFE IMAGE HELPER (Handles strings and nested objects found in your JSON)
  const getValidImage = (img: any) => {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (typeof img === "object") {
      // Check for HighlightDetails/Itinerary style vs Event style
      return img.image_url || null;
    }
    return null;
  };

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        if (!params?.tripId) return;
        const res = await fetch(`${BASE_URL}/trip/getSingleTrip/${params.tripId}`);
        const data = await res.json();
        if (res.ok) {
          setTrip(data.data);
        }
      } catch (e) {
        console.log("Error fetching trip:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [params.tripId]);

  // ✅ PARSE TRIP SUMMARY DATA
  const details = useMemo(() => {
    if (!trip) return null;
    const start = trip.StartingLocation?.starting_location;
    const budget = trip.StartingLocation?.budget_input;
    const members = trip.StartingLocation?.members;
    const destination = trip.DestinationLocation;

    let dates = "";
    if (trip.StartingLocation?.travel_dates) {
      try {
        const t = JSON.parse(trip.StartingLocation.travel_dates);
        if (t.startDate && t.endDate) {
          dates = `${t.startDate} - ${t.endDate} (${t.days} days)`;
        }
      } catch (e) {
        console.log("Date parse error", e);
      }
    }
    return { start, budget, members, destination, dates };
  }, [trip]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f766e" />
        <Text className="mt-3 text-slate-500 font-medium">Loading your journey...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 p-6">
        <Ionicons name="alert-circle-outline" size={60} color="#f97316" />
        <Text className="mt-4 text-xl font-bold text-slate-800">Trip not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-teal-700 font-semibold underline">Go back to history</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const highlights = trip.HighlightDetails || [];
  const itineraryEntries = Object.entries(trip.Itinerary || {});
  const weather = trip.Weather;
  const events = Object.entries(trip.Event || {});
  const hotels = trip.HotelsData || [];

  return (
    <View className="flex-1 bg-slate-50">
      {/* HEADER */}
      <View className="bg-white border-b border-slate-100 shadow-sm">
        <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#0f766e" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-2xl font-bold text-teal-900">
              <Ionicons name="sparkles" size={22} color="#f59e0b" /> Trip details
            </Text>
            <Text className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
              {details?.destination} Plan
            </Text>
          </View>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
      >
        {/* SUMMARY CARD */}
        <View className="px-4 mb-8">
          <View className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <View className="flex-row mb-4">
              <View className="w-11 h-11 rounded-2xl bg-teal-50 items-center justify-center mr-3">
                <Ionicons name="navigate-outline" size={24} color="#0f766e" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-pink-950" numberOfLines={2}>
                  {details?.start} ➜ {details?.destination}
                </Text>
                {details?.dates ? (
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="calendar-outline" size={14} color="#0f766e" />
                    <Text className="ml-1.5 text-xs font-bold text-blue-900">{details.dates}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View className="flex-row pt-3 border-t border-slate-50">
              <View className="flex-row items-center mr-6">
                <Ionicons name="cash-outline" size={16} color="#64748b" />
                <Text className="ml-1.5 text-xs font-semibold text-slate-600">₹{details?.budget?.toLocaleString()}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={16} color="#64748b" />
                <Text className="ml-1.5 text-xs font-semibold text-slate-600">{details?.members} Travellers</Text>
              </View>
            </View>
          </View>
        </View>

        {/* HIGHLIGHTS */}
        {highlights.length > 0 && (
          <View className="mb-8">
            <View className="px-4 flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text className="ml-2 text-lg font-bold text-teal-900">Must Visit</Text>
              </View>
              <Text className="text-[11px] font-bold text-slate-400">{highlights.length} Places</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {highlights.map((h: any, i: number) => {
                const img = getValidImage(h.image_url);
                return (
                  <View key={i} className="mr-2 w-44 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    {img ? (
                      <Image source={{ uri: img }} className="w-full h-44 bg-slate-100" />
                    ) : (
                      <View className="w-full h-44 bg-slate-100 items-center justify-center">
                        <Ionicons name="image-outline" size={32} color="#9ca3af" />
                      </View>
                    )}
                    <View className="p-3">
                      <Text className="text-[13px] font-bold text-slate-900" numberOfLines={2}>{h.place}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ITINERARY */}
        {itineraryEntries.length > 0 && (
          <View className="px-4 mb-3">
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-number-outline" size={20} color="#f59e0b" />
              <Text className="ml-2 text-lg font-bold text-teal-900">Day by day plan</Text>
            </View>

            {itineraryEntries.map(([day, items]: any) => (
              <View key={day} className="mb-2">
                <Text className="text-sm font-bold text-cyan-700 mb-1 uppercase tracking-widest">{day}</Text>
                {items.map((item: any, i: number) => {
                  const img = getValidImage(item.image_url);
                  return (
                    <View key={i} className="bg-white rounded-2xl p-3 mb-3 border border-slate-100 shadow-sm flex-row">
                      {img ? (
                        <Image source={{ uri: img }} className="w-32 h-36 rounded-xl mr-3 bg-slate-100" />
                      ) : (
                        <View className="w-32 h-32 rounded-xl bg-slate-50 items-center justify-center mr-3 border border-dashed border-slate-200">
                          <Ionicons name="trail-sign-outline" size={24} color="#9ca3af" />
                        </View>
                      )}
                      <View className="flex-1 justify-center">
                        <Text className="text-[15px] font-bold text-amber-900 mb-1">{item.title}</Text>
                        <Text className="text-[12px] font-bold text-blue-800 mb-1">{item.activity}</Text>
                        <Text className="text-[11px] text-slate-700 leading-4" >{item.about}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        {/* HOTELS (Recommended Stays) */}
        {hotels.length > 0 && (
          <View className="mb-8">
            <View className="px-4 flex-row items-center mb-3">
              <Ionicons name="bed-outline" size={20} color="#f59e0b" />
              <Text className="ml-2 text-lg font-bold text-teal-900">Where to Stay</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {hotels.map((hotel: any, i: number) => (
                <View key={i} className="mr-4 w-52 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <Image source={{ uri: hotel.image }} className="w-full h-44 bg-slate-100" />
                  <View className="p-3">
                    <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>{hotel.name}</Text>
                    <Text className="text-[10px] text-slate-400 font-bold uppercase mb-2">{hotel.type}</Text>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-teal-700 font-bold">₹{hotel.price}</Text>
                      {hotel.rating && (
                        <View className="bg-amber-100 px-1.5 py-0.5 rounded flex-row items-center">
                          <Ionicons name="star" size={10} color="#b45309" />
                          <Text className="text-[10px] font-bold text-amber-800 ml-1">{hotel.rating}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* WEATHER */}
        {weather && (
          <View className="px-4 mb-10">
            <View className="bg-white rounded-3xl p-5 border border-teal-50 shadow-sm" style={{ backgroundColor: '#f0fdfa' }}>
              <View className="flex-row items-center mb-3">
                <Ionicons name="partly-sunny-outline" size={22} color="#f59e0b" />
                <Text className="ml-2 text-lg font-bold text-teal-900">Weather & Packing</Text>
              </View>
              <Text className="text-xs text-slate-700 leading-5 mb-4">{weather.current_weather}</Text>
              
              <Text className="text-sm font-bold text-pink-900 uppercase mb-2 tracking-wider">Travel Advices</Text>
              {Array.isArray(weather.advice) && weather.advice.map((tip: string, i: number) => (
                <View key={i} className="flex-row items-start mb-2">
                  <Text className="text-teal-600 mr-2">•</Text>
                  <Text className="flex-1 text-[12px] font-semibold text-slate-800 leading-4">{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* EVENTS */}
        {events.length > 0 && (
          <View className="px-4 mb-1">
            <View className="flex-row items-center mb-2">
              <Ionicons name="sparkles-outline" size={20} color="#f97316" />
              <Text className="ml-2 text-lg font-bold text-teal-900">Seasonal Festivals</Text>
            </View>

            {events.map(([title, data]: any, i: number) => {
              const img = getValidImage(data?.image_url);
              return (
                <View key={i} className="bg-white rounded-2xl p-3 mb-3 border border-slate-100 shadow-sm flex-row">
                  {img ? (
                    <Image source={{ uri: img }} className="w-32 h-32 rounded-xl mr-4 bg-slate-100" />
                  ) : (
                    <View className="w-32 h-32 rounded-xl bg-slate-100 items-center justify-center mr-4">
                      <Ionicons name="gift-outline" size={30} color="#9ca3af" />
                    </View>
                  )}
                  <View className="flex-1 justify-center">
                    <Text className="text-[13px] font-bold text-pink-900 mb-1">{title}</Text>
                    <Text className="text-[11px] text-slate-800 leading-4">{data.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
