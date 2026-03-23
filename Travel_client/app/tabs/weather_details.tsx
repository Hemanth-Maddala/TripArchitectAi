import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";

export default function WeatherDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const destination =
    typeof params.destination === "string" && params.destination.trim().length > 0
      ? params.destination
      : "Your destination";

  const travelDates = typeof params.travelDates === "string" ? params.travelDates : "";

  const weather = useMemo(() => {
    if (typeof params.weather !== "string") return null;
    try {
      return JSON.parse(params.weather);
    } catch {
      return null;
    }
  }, [params.weather]);

  const currentCondition = weather?.raw_current?.weather?.[0];
  const weatherIconUrl =
    currentCondition?.icon
      ? `https://openweathermap.org/img/wn/${currentCondition.icon}@4x.png`
      : null;

  const advice: string[] = Array.isArray(weather?.advice) ? weather.advice : [];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 flex-row items-center justify-between border-b border-slate-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center bg-slate-50 rounded-full"
        >
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-2xl font-Lobster text-teal-900">
          <Ionicons name="sparkles" size={22} color="#f59e0b" />
          Weather Details
        </Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero card */}
        <View className="px-4 pt-6">
          <View className="bg-sky-500 rounded-3xl p-5 overflow-hidden">
            <Text className="text-xs font-semibold text-white uppercase tracking-[1.4px]">
              Destination
            </Text>
            <Text className="text-3xl font-Lobster text-red-800 mt-1">
              {destination}
            </Text>
            {travelDates ? (
              <Text className="text-white text-xs mt-1 font-semibold">
                {travelDates}
              </Text>
            ) : null}

            <View className="flex-row items-center mt-5">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons name="cloud" size={20} color="#ccfbf1" />
                  <Text className="ml-2 text-black text-lg font-semibold">
                    {currentCondition?.main || "Weather"}
                  </Text>
                </View>
                {currentCondition?.description ? (
                  <Text className="text-teal-100/90 text-xs mt-1 font-semibold">
                    {currentCondition.description}
                  </Text>
                ) : null}
              </View>

              {weatherIconUrl ? (
                <Image source={{ uri: weatherIconUrl }} style={{ width: 72, height: 72 }} />
              ) : null}
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 mt-6 gap-3">
          {/* Current */}
          <View
            className="bg-white rounded-3xl p-5 border border-slate-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row gap-2">
                <Ionicons name="star" size={20} color="#f59e0b" />
              <Text className="text-lg font-bold text-slate-900">Current weather</Text>
              </View>
              <View className="bg-emerald-50 px-3 py-1 rounded-full">
                <Text className="text-[11px] font-semibold text-emerald-700">
                  Live insight
                </Text>
              </View>
            </View>
            <Text className="text-slate-700 text-sm leading-6 mt-3">
              {weather?.current_weather || "No weather details found."}
            </Text>
          </View>

          {/* Forecast */}
          <View
            className="bg-white rounded-3xl p-5 border border-slate-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={18} color="#0f766e" />
              <Text className="ml-2 text-lg font-bold text-slate-900">
                5-day forecast
              </Text>
            </View>
            <Text className="text-slate-700 text-sm leading-6 mt-3">
              {weather?.five_day_forecast || "No forecast available."}
            </Text>
          </View>

          {/* Advice */}
          <View
            className="bg-white rounded-3xl p-5 border border-slate-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name="sparkles" size={18} color="#7c3aed" />
              <Text className="ml-2 text-lg font-bold text-slate-900">
                Packing & travel advice
              </Text>
            </View>
            {advice.length > 0 ? (
              <View className="mt-3 gap-1">
                {advice.map((tip, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-start bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3"
                  >
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    <Text className="ml-3 text-slate-700 text-sm leading-6 flex-1">
                      {tip}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-slate-600 text-sm mt-3">No advice available.</Text>
            )}
          </View>

          {/* Source */}
          <View
            className="bg-slate-50 rounded-3xl p-5 border border-slate-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark" size={18} color="#0f766e" />
              <Text className="ml-2 text-base font-bold text-slate-900">Source</Text>
            </View>
            <Text className="text-slate-600 text-sm mt-2">
              {weather?.source || "Unknown"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

