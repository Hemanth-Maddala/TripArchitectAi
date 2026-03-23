import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BudgetScreen() {
  const [selectedBudget, setSelectedBudget] = useState("");
  const [customBudget, setCustomBudget] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const router = useRouter();
  const { destination, startingLocation } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmall = width < 360;

  const bottomNavHeightEstimate = isSmall ? 78 : 88;
  const contentPaddingBottom = bottomNavHeightEstimate + insets.bottom;
  const bottomIconClass = isSmall ? "w-7 h-7" : "w-8 h-8";

  const chatLottie = Math.min(84, Math.max(56, Math.round(width * 0.2)));
  const chatbotTop = Math.max(insets.top, 8) - 5;
  const chatbotLeft = Math.max(10, Math.round(width * 0.04));
  const contentPaddingTop = chatbotTop + chatLottie + 20;

  const handleTabPress = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route as any);
  };

  const budgetOptions = [
    {
      id: "low",
      label: "Low",
      range: "≤ ₹10,000",
      value: 10000,
      img: require("../../assets/images/less10k.png"),
      color: "bg-blue-600",
      color2: "bg-blue-400",
    },
    {
      id: "moderate",
      label: "Moderate",
      range: "≤ ₹25K",
      value: 25000,
      img: require("../../assets/images/10to25.png"),
      color: "bg-orange-600",
      color2: "bg-orange-400",
    },
    {
      id: "high",
      label: "High",
      range: "≤ ₹50,000",
      value: 50000,
      img: require("../../assets/images/less50k.png"),
      color: "bg-green-600",
      color2: "bg-green-400",
    },
  ];

  // When user taps a budget card
  const handleBudgetSelect = (budgetId: string) => {
    setSelectedBudget(budgetId);
    setCustomBudget("");
  };

  // When user types custom amount
  const handleCustomBudgetChange = (value: string) => {
    setCustomBudget(value);
    setSelectedBudget("");
  };

  // Submit Handler
  const handleSubmit = () => {
  if (!selectedBudget && !customBudget) return;

  let finalBudgetNumber = 0;

  // If card selected
  if (selectedBudget === "low") {
    finalBudgetNumber = 10000;
  } 
  else if (selectedBudget === "moderate") {
    finalBudgetNumber = 25000;
  } 
  else if (selectedBudget === "high") {
    finalBudgetNumber = 50000;
  }

  // If custom entered
  if (customBudget) {
    finalBudgetNumber = Number(customBudget);
  }

  console.log("Final Budget Number:", finalBudgetNumber);

  router.push({
    pathname: "/tabs/travel_dates",
    params: {
      startingLocation,
      destination,
      budget: finalBudgetNumber.toString(), // send as string param
    },
  } as any);
};

  return (
    <ImageBackground
      source={require("../../assets/images/budget_bg.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            position: "absolute",
            top: chatbotTop,
            left: chatbotLeft,
            zIndex: 20,   // ensure above overlay
          }}
        >
          <LottieView
            source={require("../../assets/animations/Live_chatbot.json")}
            autoPlay
            loop
            style={{ width: chatLottie, height: chatLottie }}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: contentPaddingTop,
            paddingBottom: contentPaddingBottom,
          }}
        >
          {/* ===== Enter Custom Budget Section ===== */}
          <View className="px-6 mb-5">
            <Text
              className="text-4xl font-Lobster text-teal-900 mb-2 text-center"
              style={{
                textShadowColor: "rgba(0,0,0,0.5)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              Enter Your Budget
            </Text>

            <Text className="text-xl font-DancingScript text-white/90 text-center mb-4">
              Enter your travel budget
            </Text>

            <View
              className="bg-white rounded-3xl p-4 flex-row items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text className="text-3xl text-slate-600 mr-3">₹</Text>

              <TextInput
                className="flex-1 text-lg text-slate-900"
                placeholder="Enter Amount"
                placeholderTextColor="#94a3b8"
                value={
                  customBudget
                    ? customBudget
                    : selectedBudget
                      ? budgetOptions.find(b => b.id === selectedBudget)?.value.toString()
                      : ""
                }
                onChangeText={handleCustomBudgetChange}
                keyboardType="numeric"
              />


              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-blue-600 px-6 py-3 rounded-2xl ml-2"
                activeOpacity={0.7}
                disabled={!selectedBudget && !customBudget}
                style={{
                  opacity: selectedBudget || customBudget ? 1 : 0.5,
                }}
              >
                <Text className="text-white font-bold text-base">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ===== OR Separator ===== */}
          <View className="px-6 mb-4">
            <View className="flex-row items-center justify-center">
              <View className="flex-1 h-px bg-black/50" />
              <Text className="px-4 text-black text-lg font-bold">Or</Text>
              <View className="flex-1 h-px bg-black/50" />
            </View>
          </View>

          {/* ===== Header Section ===== */}
          <View className="px-6 pt-4 pb-6 items-center">
            <Text
              className="text-4xl font-Lobster text-teal-900 mb-2 text-center"
              style={{
                textShadowColor: "rgba(0,0,0,0.5)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Set Your Budget
            </Text>

            <Text className="text-xl font-DancingScript text-white/90 text-center">
              Choose your travel budget
            </Text>
          </View>

          {/* ===== Budget Cards ===== */}
          <View className="px-4">
            {budgetOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleBudgetSelect(option.id)}
                className={`w-full rounded-3xl p-4 mb-3 flex-row items-center ${selectedBudget === option.id
                  ? option.color
                  : option.color2
                  }`}
                activeOpacity={0.8}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  borderWidth: selectedBudget === option.id ? 3 : 0,
                  borderColor:
                    selectedBudget === option.id ? "#fff" : "transparent",
                }}
              >
                <Image
                  source={option.img}
                  className="w-20 h-20 mr-4"
                  resizeMode="contain"
                />

                <View className="flex-1">
                  <Text className="text-2xl font-bold text-white mb-1">
                    {option.label}
                  </Text>
                  <Text className="text-xl font-semibold text-white">
                    {option.range}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* Sticky Bottom Navigation Bar */}
        <View
          className="absolute bottom-0 left-0 right-0 bg-slate-50 border-t border-slate-200 shadow-lg"
          style={{ paddingBottom: insets.bottom }}
        >
          <View className={`flex-row justify-around items-center ${isSmall ? "py-2" : "py-3"} px-4`}>
            <TouchableOpacity
              className="flex-1 items-center"
              onPress={() => handleTabPress("home", "/tabs/home_screen")}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../assets/images/house.png")}
                className={`${bottomIconClass} ${activeTab === "home" ? "opacity-100" : "opacity-50"}`}
                resizeMode="cover"
              />
              <Text className={`text-xs mt-1 ${activeTab === "home" ? "text-teal-600 font-semibold" : "text-slate-500"}`}>
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center"
              onPress={() => handleTabPress("travel", "/tabs/travel")}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../assets/images/airplane.png")}
                className={`${bottomIconClass} ${activeTab === "travel" ? "opacity-100" : "opacity-50"}`}
                resizeMode="cover"
              />
              <Text className={`text-xs mt-1 ${activeTab === "travel" ? "text-teal-600 font-semibold" : "text-slate-500"}`}>
                Travel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center"
              onPress={() => handleTabPress("profile", "/tabs/profile")}
              activeOpacity={0.7}
            >
              <Image
                source={require("../../assets/images/boy.png")}
                className={`${bottomIconClass} ${activeTab === "profile" ? "opacity-100" : "opacity-50"}`}
                resizeMode="cover"
              />
              <Text className={`text-xs mt-1 ${activeTab === "profile" ? "text-teal-600 font-semibold" : "text-slate-500"}`}>
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
