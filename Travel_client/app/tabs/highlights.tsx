import { Text, View, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

interface HighlightImage {
  place: string;
  image_url: string;
}

interface HighlightsProps {
  highlights: HighlightImage[];
  destinationState?: string;
  destinationInput?: string;
}

export default function Highlights({ highlights, destinationState,destinationInput }: HighlightsProps) {
  const router = useRouter();

  if (!highlights || highlights.length === 0) {
    return null;
  }

  const handleDetails = () => {
    router.push({
      pathname: "/tabs/highlight_details",
      params: {
        highlights: JSON.stringify(highlights),
        destinationState: destinationState || "",
        destinationInput: destinationInput || "",
      },
    });
  };

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
        {/* Title */}
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-amber-100">
            <Ionicons name="star" size={22} color="#f59e0b" />
          </View>
          <Text className="text-2xl font-Lobster text-teal-900">
            Top Highlights
          </Text>
          <FontAwesome
            name="arrow-right"
            size={20}
            color="#14b8a6"
            className="ml-auto"
            onPress={handleDetails}
          />
        </View>

        {/* Highlights List */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          <View className="flex-row gap-4">
            {highlights.map((item, index) => (
              <View
                key={index}
                className="w-36 rounded-2xl overflow-hidden bg-slate-50"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                {/* Image */}
                <Image
                  source={{ uri: item.image_url }}
                  className="w-36 h-40"
                  resizeMode="cover"
                  defaultSource={require("../../assets/images/login_bg.png")}
                />

                {/* Place Name */}
                {/* <View className="p-3">
                  <Text className="text-sm font-bold text-teal-900" numberOfLines={2}>
                    {item.place}
                  </Text> */}
                  {/* <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={12} color="#14b8a6" />
                    <Text className="text-xs text-slate-500 ml-1">Must Visit</Text>
                  </View> */}
                {/* </View> */}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Info Footer */}
        <View className="bg-teal-50 rounded-xl p-3 mt-3 flex-row items-center">
          <Ionicons name="information-circle" size={18} color="#0f766e" />
          <Text className="text-sm text-teal-800 ml-2 flex-1">
            Suggested top {highlights.length} amazing places to explore in{" "}
            {destinationInput || "your destination"}
          </Text>
        </View>
      </View>
    </View>
  );
}