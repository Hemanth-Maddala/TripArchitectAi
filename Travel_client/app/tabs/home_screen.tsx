import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ToastAndroid
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Destinations data
const destinations = [
  { id: 1, name: "Paris", description: "The City of Light", image: require("../../assets/images/Paris.png") },
  { id: 2, name: "Maldives", description: "Tropical Paradise", image: require("../../assets/images/Maldives.png") },
  { id: 3, name: "Manali", description: "Snowy Mountain Escape", image: require("../../assets/images/manali.png") },
  { id: 4, name: "Goa", description: "Beach & Party Capital", image: require("../../assets/images/goa.png") },
  { id: 5, name: "Ooty", description: "Queen of Hill Stations", image: require("../../assets/images/ooty.png") },
  { id: 6, name: "Darjeeling", description: "Himalayan Views", image: require("../../assets/images/darjeeling.png") },
  { id: 7, name: "Switzerland", description: "Alpine Wonderland", image: require("../../assets/images/Switzerland.png") },
];

export default function HomeScreen() {
  const [startingLocation, setStartingLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();
  const params = useLocalSearchParams();
  const {email} = params
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmall = width < 360;
  const heroHeight = Math.min(height * 0.40, width * 1.05);
  const destCardW = Math.min(148, Math.max(108, width * 0.34));
  const destImgH = Math.round(destCardW * 1.35);
  const chatLottie = Math.min(88, Math.max(56, Math.round(width * 0.2)));
  const bottomIconClass = isSmall ? "w-7 h-7" : "w-8 h-8";

  const handleTabPress = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push({
      pathname: route,
      params : {
        tab: tab,
      }
    } as any);
  };

  const getstarted = () => {
    if (startingLocation.trim() === "") {
      ToastAndroid.show("Please enter your starting location.", ToastAndroid.SHORT);
      return;
    }
    if (destination.trim() === "") {
      ToastAndroid.show("Please enter your destination.", ToastAndroid.SHORT);
      return;
    }

    router.push({
      pathname: "/tabs/budget",
      params: {
        startingLocation,
        destination,
      },
    } as any);
  };

  return (
    <View className="flex-1 bg-white">

      {/* Chatbot Animation */}
      <View style={{ position: "absolute", top: Math.max(insets.top, 8)-5, left: 15, zIndex: 20 }}>
        <LottieView
          source={require("../../assets/animations/Live_chatbot.json")}
          autoPlay
          loop
          style={{ width: chatLottie, height: chatLottie }}
        />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 88 + insets.bottom }}>

        {/* ===== HERO SECTION ===== */}
        <View className="relative" style={{ height: heroHeight }}>

          <Image
            source={require("../../assets/images/login_bg.png")}
            className="absolute w-full h-full"
            resizeMode="cover"
          />

          {/* Dark overlay */}
          <View className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <View className="flex-1 justify-end px-5 pb-5">

            {/* Heading */}
            <Text className={`${width < 360 ? "text-3xl" : "text-4xl"} text-white font-DancingScript`}>
              Welcome <Text className="font-Lobster text-teal-700">Hemanth..</Text>
            </Text>
            <Text className={`${width < 360 ? "text-xl" : "text-2xl"} text-white font-DancingScript mb-4`}>
              Start Travelling to ?
            </Text>

            {/* Floating Input Card */}
            <View className="bg-white/85 rounded-2xl px-4 py-4 shadow-2xl">

              {/* Starting Location */}
              <View className="flex-row items-center border border-blue-200 rounded-xl px-3 py-2 mb-3">
                <Image
                  source={require("../../assets/images/location.png")}
                  className="w-5 h-5 mr-2 opacity-70"
                />
                <TextInput
                  className="flex-1 text-slate-900 text-base"
                  placeholder="Starting Location"
                  placeholderTextColor="#94a3b8"
                  value={startingLocation}
                  onChangeText={setStartingLocation}
                />
              </View>

              {/* Destination */}
              <View className="flex-row items-center border border-blue-200 rounded-xl px-3 py-2">
                <Image
                  source={require("../../assets/images/location.png")}
                  className="w-5 h-5 mr-2 opacity-70"
                />
                <TextInput
                  className="flex-1 text-slate-900 text-base"
                  placeholder="Destination"
                  placeholderTextColor="#94a3b8"
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>

            </View>
          </View>
        </View>

        {/* ===== POPULAR DESTINATIONS ===== */}
        <View className="px-6 py-4 bg-slate-50">
          <Text className={`${width < 360 ? "text-2xl" : "text-3xl"} font-Lobster text-slate-900 mb-4`}>
            Popular Destinations
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {destinations.map((item) => (
              <TouchableOpacity key={item.id} activeOpacity={0.7} className="bg-white rounded-2xl shadow-lg mr-3 overflow-hidden" style={{ width: destCardW }} onPress={() => {setDestination(item.name)}}>
                <Image source={item.image} className="rounded-t-2xl" style={{ width: destCardW, height: destImgH }} />
                <View className="p-2">
                  <Text className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-slate-500 font-DancingScript">
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ===== TRIP ARCHITECT CARD ===== */}
        <View className="px-6 py-6 bg-white">
          <View className="relative rounded-2xl overflow-hidden">
            <Image
              source={require("../../assets/images/aeroplane.png")}
              className="w-full h-60"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/30" />

            <View className="absolute inset-0 items-center justify-center px-3">
              <Text className={`${width < 360 ? "text-3xl" : "text-4xl"} font-Lobster text-teal-200 mb-6 text-center`}>
                TripArchitect AI
              </Text>
              <TouchableOpacity
                className="bg-teal-500 px-6 py-3 rounded-lg shadow-lg"
                onPress={getstarted}
              >
                <Text className="text-white font-semibold text-base">
                  Get Plan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ===== BOTTOM NAV ===== */}
      <View className="absolute bottom-0 left-0 right-0 bg-slate-50 border-t border-slate-200" style={{ paddingBottom: insets.bottom }}>
        <View className={`flex-row justify-around items-center ${isSmall ? "py-2" : "py-3"}`}>

          <TouchableOpacity onPress={() => handleTabPress("home", "/tabs/home_screen")} className="items-center flex-1">
            <Image source={require("../../assets/images/house.png")} className={`${bottomIconClass} ${activeTab === "home" ? "opacity-100" : "opacity-40"}`} />
            <Text className={`${activeTab === "home" ? "text-teal-600 font-semibold" : "text-slate-500"} text-xs mt-1`}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleTabPress("travel", "/profiletab/trip-historydet")} className="items-center flex-1">
            <Image source={require("../../assets/images/airplane.png")} className={`${bottomIconClass} ${activeTab === "travel" ? "opacity-100" : "opacity-40"}`} />
            <Text className={`${activeTab === "travel" ? "text-teal-600 font-semibold" : "text-slate-500"} text-xs mt-1`}>
              Travel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleTabPress("profile", "/tabs/profile")} className="items-center flex-1">
            <Image source={require("../../assets/images/boy.png")} className={`${bottomIconClass} ${activeTab === "profile" ? "opacity-100" : "opacity-40"}`} />
            <Text className={`${activeTab === "profile" ? "text-teal-600 font-semibold" : "text-slate-500"} text-xs mt-1`}>
              Profile
            </Text>
          </TouchableOpacity>

        </View>
      </View>

    </View>
  );
}
