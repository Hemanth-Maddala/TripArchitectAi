import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Pressable, Linking
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

export default function HighlightDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const thumbSize = Math.min(130, Math.round(width * 0.32));

  const highlights = params.highlights
    ? JSON.parse(params.highlights as string)
    : [];
  const destinationState = (params.destinationState as string) || "Your destination";
  const destinationInput = (params.destinationInput as string) || "your destination";


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
            <Text >
              Top Highlights
            </Text>
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
        {highlights.map((item: { place: string; image_url: string }, index: number) => (
          <View
            key={index}
            className="mx-4 mb-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <View className="bg-white rounded-2xl overflow-hidden flex-row">
              {/* Left: Image */}
              <Image
                source={{ uri: item.image_url }}
                style={{ width: thumbSize, height: thumbSize }}
                resizeMode="cover"
              />

              {/* Right: Place name + details */}
              <View className="flex-1 p-4 justify-center">
                <View className="flex-row items-center mb-1">
                  <View className="w-8 h-8 rounded-lg bg-amber-100 items-center justify-center mr-2">
                    <Text className="text-amber-700 font-bold text-sm">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-teal-900 flex-1" numberOfLines={2}>
                    {item.place}
                  </Text>
                </View>
                <Pressable onPress={() => Linking.openURL(item.image_url)} className="flex-row items-center mt-2">
                  <Entypo name="folder-images" size={16} color="#14b8a6"/>
                  <Text className="text-xs text-slate-500 font-extrabold ml-1.5">CLICK HERE FOR IMAGE</Text>
                </Pressable>
                <View className="flex-row items-center mt-2 pt-2 border-t border-slate-100">
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text className="text-xs text-slate-600 ml-1.5">Top pick in {destinationState}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Bottom CTA / Info card */}
        <View className="mx-4 mt-2 p-4 rounded-2xl bg-teal-50 border border-teal-100">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-teal-100 items-center justify-center mr-3">
              <Ionicons name="sparkles" size={22} color="#0f766e" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-teal-900">
                {highlights.length} places to explore
              </Text>
              <Text className="text-sm text-teal-700 mt-0.5">
                These are the top visiting places in {destinationInput} that you shouldn't miss!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
