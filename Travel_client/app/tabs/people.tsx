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

export default function PeopleScreen() {
  const [selectedOption, setSelectedOption] = useState("");
  const [customPeople, setCustomPeople] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const router = useRouter();
  const { width } = useWindowDimensions();
  const chatLottie = Math.min(84, Math.max(56, Math.round(width * 0.2)));
  const { destination, budget, travelDates, startingLocation } = useLocalSearchParams();
  const finalBudgetText = budget ? budget.toString() : "";
  const finalTravelDates = travelDates ? JSON.parse(travelDates.toString()) : null;

  console.log("Received Params:", {
    destination,
    budget: finalBudgetText,
    travelDates: finalTravelDates,
  });

  const handleTabPress = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route as any);
  };

  const peopleOptions = [
    {
      id: "single",
      label: "Solo Trip",
      count: "1 Person",
      img: require("../../assets/images/single.png"),
      value: 1,
    },
    {
      id: "duo",
      label: "Duo Trip",
      count: "2 People",
      img: require("../../assets/images/duo.png"),
      value: 2,
    },
    {
      id: "family",
      label: "Family Trip",
      count: "3-4 People",
      img: require("../../assets/images/family.png"),
      value: 4,
    },
    {
      id: "group",
      label: "Group Trip",
      count: "5-6 People",
      img: require("../../assets/images/group.png"),
      value: 6,
    },
  ];

  const handlePeopleSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setCustomPeople("");
  };

  const handleCustomPeopleChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setCustomPeople(numericValue);
    setSelectedOption("");
  };

  const handleSubmit = () => {
    if (!selectedOption && !customPeople) return;

    let finalPeopleCount = 0;
    if (selectedOption) {
      const option = peopleOptions.find((opt) => opt.id === selectedOption);
      finalPeopleCount = option ? option.value : 0;
    }
    if (customPeople) finalPeopleCount = parseInt(customPeople, 10);

    console.log("Selected People Count:", finalPeopleCount);
    router.push({
      pathname: "/tabs/planning",
      params: {
        startingLocation: startingLocation,
        destination: destination,
        budget: finalBudgetText,
        travelDates: JSON.stringify(finalTravelDates),
        people: finalPeopleCount,
      },
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/members.png")}
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
            top: 25,
            left: 15,
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
          contentContainerStyle={{ paddingTop: 60, paddingBottom: 80 }}
        >
          {/* ===== Header ===== */}
          <View className="px-6 mb-6 items-center">
            <Text
              className="text-4xl font-Lobster text-teal-900 mb-2 text-center"
              style={{
                textShadowColor: "rgba(0,0,0,0.5)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Who's Travelling?
            </Text>

            <Text className="text-2xl font-DancingScript text-black/90 text-center">
              Choose your travel group size
            </Text>
          </View>

          {/* ===== Custom Input ===== */}
          <View className="px-8 mb-6">
            <View
              className="bg-white/90 rounded-3xl px-4 py-3 flex-row items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              <Text className="text-2xl mr-3">👥</Text>

              <TextInput
                className="flex-1 text-lg text-slate-900"
                placeholder="Enter number of people"
                placeholderTextColor="#94a3b8"
                value={customPeople? customPeople:selectedOption?peopleOptions.find(opt=>opt.id===selectedOption)?.value.toString():""}
                onChangeText={handleCustomPeopleChange}
                keyboardType="numeric"
              />

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={!selectedOption && !customPeople}
              >
                <View
                  className="px-6 py-2 rounded-full bg-teal-600"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 6,
                    opacity: selectedOption || customPeople ? 1 : 0.5,
                  }}
                >
                  <Text className="text-white font-bold">Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* ===== OR Divider ===== */}
          <View className="px-8 mb-5">
            <View className="flex-row items-center">
              <View className="flex-1 h-px bg-black/40" />
              <Text className="px-4 font-bold text-black">OR</Text>
              <View className="flex-1 h-px bg-black/40" />
            </View>
          </View>

          {/* ===== People Cards ===== */}
          <View className="px-8">
            {peopleOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handlePeopleSelect(option.id)}
                activeOpacity={0.85}
                className="w-full mb-4"
              >
                <View
                  className="rounded-3xl p-4 flex-row items-center bg-white/85"
                  style={{
                    borderWidth: selectedOption === option.id ? 2 : 0,
                    borderColor:
                      selectedOption === option.id ? "#0f766e" : "transparent",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 6,
                    elevation: 6,
                    transform: [
                      { scale: selectedOption === option.id ? 1.02 : 1 },
                    ],
                  }}
                >
                  {/* Icon Bubble */}
                  <View
                    className="w-20 h-20 rounded-2xl items-center justify-center mr-4"
                    style={{
                      backgroundColor:
                        selectedOption === option.id ? "#0f766e" : "#14b8a6",
                    }}
                  >
                    <Image
                      source={option.img}
                      className="w-14 h-14"
                      resizeMode="contain"
                    />
                  </View>

                  {/* Text */}
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-slate-900">
                      {option.label}
                    </Text>
                    <Text className="text-base text-slate-600">
                      {option.count}
                    </Text>
                  </View>

                  {/* Check Mark */}
                  {selectedOption === option.id && (
                    <View className="w-8 h-8 rounded-full bg-teal-600 items-center justify-center">
                      <Text className="text-white font-bold">✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* ===== Bottom Navigation ===== */}
      <View className="bg-white/90 border-t border-slate-200">
        <View className="flex-row justify-around items-center py-3 px-4">
          {/* Home */}
          <TouchableOpacity
            className="items-center"
            onPress={() => handleTabPress("home", "/tabs/home_screen")}
          >
            <Image
              source={require("../../assets/images/house.png")}
              className={`w-7 h-7 ${activeTab === "home" ? "opacity-100" : "opacity-40"
                }`}
            />
            <Text
              className={`text-xs mt-1 ${activeTab === "home"
                  ? "text-teal-600 font-semibold"
                  : "text-slate-500"
                }`}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Travel */}
          <TouchableOpacity
            className="items-center"
            onPress={() => handleTabPress("travel", "/tabs/travel")}
          >
            <Image
              source={require("../../assets/images/airplane.png")}
              className={`w-7 h-7 ${activeTab === "travel" ? "opacity-100" : "opacity-40"
                }`}
            />
            <Text
              className={`text-xs mt-1 ${activeTab === "travel"
                  ? "text-teal-600 font-semibold"
                  : "text-slate-500"
                }`}
            >
              Travel
            </Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            className="items-center"
            onPress={() => handleTabPress("profile", "/tabs/profile")}
          >
            <Image
              source={require("../../assets/images/boy.png")}
              className={`w-7 h-7 ${activeTab === "profile" ? "opacity-100" : "opacity-40"
                }`}
            />
            <Text
              className={`text-xs mt-1 ${activeTab === "profile"
                  ? "text-teal-600 font-semibold"
                  : "text-slate-500"
                }`}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
