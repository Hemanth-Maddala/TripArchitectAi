import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type EventEntry = {
  description: string;
  image_url?: {
    place: string;
    image_url: string;
  };
};

type EventsMap = Record<string, EventEntry>;

export default function EventDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const events: EventsMap = useMemo(() => {
    if (typeof params.events === "string") {
      try {
        return JSON.parse(params.events) as EventsMap;
      } catch {
        return {};
      }
    }
    return {};
  }, [params.events]);

  const eventEntries = Object.entries(events);

  const destinationInput =
    (params.destinationInput as string) || "your destination";

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header (mirroring highlight details) */}
      <View className="bg-white border-b border-slate-100">
        <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#0f766e" />
          </TouchableOpacity>
          <Text className="text-2xl font-Lobster text-teal-900 flex-row items-center">
            <Ionicons name="sparkles" size={22} color="#f59e0b" />
            <Text> Seasonal Events</Text>
          </Text>
          <View className="w-10" />
        </View>
        <View className="px-4 pb-3">
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="#14b8a6" />
            <Text className="text-sm text-slate-600 ml-2 font-medium">
              {destinationInput}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 20 }}
      >
        {eventEntries.map(([title, data], index) => (
          <View
            key={title}
            className="mx-4 mb-6 bg-white rounded-2xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 15,
              elevation: 6,
            }}
          >
            <View className="bg-white rounded-2xl overflow-hidden">
              {/* Top: big full-width image */}
              {data.image_url?.image_url ? (
                <Image
                  source={{ uri: data.image_url.image_url }}
                  className="w-full h-64"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-56 items-center justify-center bg-slate-100">
                  <Ionicons name="image-outline" size={32} color="#9ca3af" />
                </View>
              )}

              {/* Bottom: title + description */}
              <View className="p-4">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 rounded-lg bg-amber-100 items-center justify-center mr-2">
                    <Text className="text-amber-700 font-bold text-sm">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-pink-900 flex-1">
                    {title}
                  </Text>
                </View>
                <Text className="text-sm text-slate-700 leading-5">
                  {data.description || "No description available for this event."}
                </Text>
                <View className="flex-row items-center mt-3 pt-2 border-t border-slate-100">
                  <Ionicons name="calendar" size={14} color="#f59e0b" />
                  <Text className="text-xs text-teal-600 ml-1.5">
                    Seasonal event near {destinationInput} in your Travelling period
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Bottom info card */}
        <View className="mx-4 mt-2 p-4 rounded-2xl bg-teal-50 border border-teal-100">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-teal-100 items-center justify-center mr-3">
              <Ionicons name="sparkles" size={22} color="#0f766e" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-amber-900">
                Top {eventEntries.length} events to explore
              </Text>
              <Text className="text-sm text-teal-700 mt-0.5">
                These are seasonal festivals and experiences around{" "}
                {destinationInput} for your trip.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

