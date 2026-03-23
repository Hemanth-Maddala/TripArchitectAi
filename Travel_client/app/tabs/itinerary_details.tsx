import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useState, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Types
interface ItineraryItem {
  title: string;
  activity: string;
  about: string;
  image_url?: string | null;
}

interface ItineraryData {
  [day: string]: ItineraryItem[];
}

// Helper function to get time of day based on index
function getTimeOfDay(index: number): string {
  const times = ["Morning", "Afternoon", "Evening", "Night"];
  return times[index] || `Activity ${index + 1}`;
}

export default function ItineraryDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const itinerary: ItineraryData = useMemo(() => {
    try {
      return params.itinerary
        ? (JSON.parse(params.itinerary as string) as ItineraryData)
        : {};
    } catch (e) {
      console.log("Failed to parse itinerary:", e);
      return {};
    }
  }, [params.itinerary]);

  const destinationState = (params.destinationState as string) || "Your destination";
  const destinationInput = (params.destinationInput as string) || "your destination";

  const days = Object.keys(itinerary);
  const [selectedDay, setSelectedDay] = useState(days[0] || "Day 1");

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
            Your {days.length}-Day Itinerary
          </Text>
          <View className="w-10" />
        </View>
        <View className="px-4 pb-3">
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="#14b8a6" />
            <Text className="text-sm text-slate-600 ml-2 font-medium">
              {destinationInput || destinationState}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 20 }}
      >
        <View className="px-4">
          <View
            className="bg-white rounded-3xl p-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {/* Day Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
            >
              <View className="flex-row gap-3">
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => setSelectedDay(day)}
                    className={`px-5 py-3 rounded-2xl ${selectedDay === day
                        ? "bg-teal-600"
                        : "bg-slate-100 border border-teal-200"
                      }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-base font-semibold ${selectedDay === day ? "text-white" : "text-teal-700"
                        }`}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Activities */}
            <View>
              {itinerary[selectedDay]?.map((item: ItineraryItem, index: number) => (
                <View
                  key={index}
                  className={`mb-4 pb-4 ${index < (itinerary[selectedDay]?.length || 0) - 1
                      ? "border-b border-slate-100"
                      : ""
                    }`}
                >
                  <View>
                    <View className="flex-row items-center mb-2">
                      <View className="bg-amber-200 px-2 py-1 rounded-lg mr-2">
                        <Text className="text-xs font-semibold text-amber-800">
                          {getTimeOfDay(index)}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-lg font-bold text-amber-800 mb-1">
                      ⭐ {item.title}
                    </Text>

                    <Text className="text-md text-teal-900 font-bold mb-1">
                      {item.activity}
                    </Text>

                    <Text className="text-sm text-slate-700 leading-5">
                      {item.about}
                    </Text>
                    {item.image_url ? (
                      <Image
                        source={{ uri: item.image_url }}
                        className="w-full h-52 rounded-xl mt-3"
                        resizeMode="cover"
                      />
                    ) : null}

                  </View>
                </View>
              ))}
            </View>

            {/* Day Summary */}
            <View className="mt-2 p-3 rounded-2xl bg-teal-50 border border-teal-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-teal-100 items-center justify-center mr-3">
                  <Ionicons name="sparkles" size={22} color="#0f766e" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-teal-900">
                    {itinerary[selectedDay]?.length || 0} activities planned for {selectedDay}
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}
