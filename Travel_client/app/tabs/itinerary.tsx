import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

interface ItineraryItem {
  title: string;
  activity: string;
  about: string;
  image_url: string;
}

interface ItineraryProps {
  itinerary: { [key: string]: ItineraryItem[] };
  destinationState?: string;
  destinationInput?: string;
}

export default function Itinerary({ itinerary, destinationState, destinationInput }: ItineraryProps) {
  const router = useRouter();
  const days = Object.keys(itinerary || {});

  const handleDetails = () => {
    router.push({
      pathname: "/tabs/itinerary_details",
      params: {
        itinerary: JSON.stringify(itinerary),
        destinationState: destinationState || "",
        destinationInput: destinationInput || "",
      },
    });
  };

  if (!days.length) return null;

  return (
    <View className="px-4 mb-6">
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
        {/* Title + Arrow */}
        <View className="flex-row items-center mb-5">
          <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-blue-100">
            <Ionicons name="calendar" size={22} color="#3b82f6" />
          </View>
          <Text className="text-2xl font-Lobster text-teal-900 flex-1">
            Your {days.length}-Day Itinerary
          </Text>
          <TouchableOpacity onPress={handleDetails} activeOpacity={0.7}>
            <FontAwesome name="arrow-right" size={20} color="#14b8a6" />
          </TouchableOpacity>
        </View>

        {/* Teaser */}
        <View className="bg-teal-50 rounded-xl p-3 flex-row items-center">
          <Ionicons name="information-circle" size={18} color="#0f766e" />
          <Text className="text-sm text-teal-800 ml-2 flex-1">
            View your day-by-day plan with activities for{" "}
            {destinationInput || destinationState || "your destination"}
          </Text>
        </View>
      </View>
    </View>
  );
}
