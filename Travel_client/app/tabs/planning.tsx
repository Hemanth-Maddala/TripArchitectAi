import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";

export default function PlanningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width, height } = useWindowDimensions();

  // ---- Read params safely ----
  const startingLocation = params.startingLocation as string | undefined;
  const destination = params.destination as string | undefined;
  const budget = params.budget as string | undefined;
  const people = params.people as string | undefined;
  const travelDates = params.travelDates as string | undefined;
  const [isLoading, setIsLoading] = useState(true);
  const [done,setdone]=useState(false);

  console.log("Planning Screen Params:", {
    startingLocation,
    destination,
    budget,
    travelDates,
    people,
  });

  // ---- Destination ----
  const destinationText =
    destination && destination !== "undefined"
      ? destination
      : "Not selected";

  // ---- Budget ----
  const budgetText =
    budget && budget !== "undefined"
      ? `₹${budget}`
      : "Not selected";

  // ---- People ----
  const peopleCount =
    people && people !== "undefined"
      ? parseInt(people, 10)
      : 0;

  const peopleText =
    peopleCount > 0
      ? `${peopleCount} ${peopleCount === 1 ? "Person" : "People"}`
      : "Not selected";

  // ---- Travel Dates ----
  let travelDatesText = "Not selected";

  if (
    travelDates &&
    travelDates !== "undefined" &&
    (travelDates.startsWith("{") || travelDates.startsWith("["))
  ) {
    try {
      const parsed = JSON.parse(travelDates);

      if (parsed.startDate && parsed.endDate) {
        travelDatesText = `${parsed.startDate} → ${parsed.endDate}`;
      } else if (parsed.days) {
        travelDatesText = `${parsed.days} Days`;
      }
    } catch {
      travelDatesText = "Not selected";
    }
  } else if (travelDates && travelDates !== "undefined") {
    travelDatesText = travelDates;
  }

  // ---- Button Handler ----
  const handleStartPlanning = () => {
    router.push({
      pathname: "/tabs/planning_result",
      params: {
        startingLocation: startingLocation,
        destination: destination,
        budget: budget,
        travelDates: travelDates,
        people: people
      },
    });
  };

  useEffect(() => {
  const timer1 = setTimeout(() => {
    setdone(true);
  }, 3000);

  const timer2 = setTimeout(() => {
    setIsLoading(false);
  }, 4500);
  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  };
}, []);

  const chatLottie = Math.min(84, Math.max(56, Math.round(width * 0.2)));

  if (isLoading) {
    return (
      <ImageBackground
        source={require("../../assets/images/mrng_beach.png")}
        resizeMode="cover"
        className="flex-1"
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
        <View className="absolute inset-0 bg-black/10" />

        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-5xl font-Lobster text-white mb-3" style={{ textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -4, height: 2 }, textShadowRadius: 10 }}>
          Your Trip    
        </Text>
        <Text className="text-2xl font-Lobster text-white mt-4" style={{ textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -4, height: 2 }, textShadowRadius: 10 }}>
                Analysing your travel preferences...
            </Text>
          {!done ? (
            <Text className="text-2xl text-white/80 mt-3">
            ● ● ●
            </Text>
          ) : (
            <Text className="text-2xl font-extrabold text-teal-950 mt-3">
            Almost Done...
            </Text>
          )}
          <View className="justify-center items-center">
            <LottieView
              source={require("../../assets/animations/checklist.json")}
              autoPlay
              loop
              style={{ width: Math.min(width, 420), height: height * 0.45 }}
            />
          </View>

        </View>
      </ImageBackground>
    );
  }

  return (
    <View className="flex-1 bg-white">
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
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ===== HEADER ===== */}
        <View className="flex-row items-center justify-center px-6 pt-12 pb-4">
          <Text className="text-4xl font-Lobster text-teal-900">
            Your Trip
          </Text>
        </View>

        {/* ===== TOP BANNER ===== */}
        <View className="relative h-64 mx-4 mb-6">
          <ImageBackground
            source={require("../../assets/images/bg_details.png")}
            resizeMode="cover"
            className="w-full h-full rounded-3xl overflow-hidden"
          >
            <View className="absolute inset-0 bg-teal-900/40" />

            <View className="flex-1 justify-center items-center px-6">
              <Text className="text-4xl text-white font-Lobster text-center mb-2">
                Your Trip Summary
              </Text>
              <Text className="text-lg text-white/90 text-center font-semibold">
                Review your selections
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* ===== DETAILS CARD ===== */}
        <View className="px-4">
          <View
            className="bg-white rounded-3xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            {/* Destination */}
            <DetailRow
              icon="location"
              iconBg="bg-teal-100"
              iconColor="#0f766e"
              title="Destination"
              value={destinationText}
            />

            {/* Budget */}
            <DetailRow
              icon="wallet"
              iconBg="bg-amber-100"
              iconColor="#f59e0b"
              title="Budget"
              value={budgetText}
            />

            {/* Dates */}
            <DetailRow
              icon="calendar"
              iconBg="bg-blue-100"
              iconColor="#3b82f6"
              title="Travel Dates"
              value={travelDatesText}
            />

            {/* People */}
            <DetailRow
              icon="people"
              iconBg="bg-purple-100"
              iconColor="#a855f7"
              title="Travelers"
              value={peopleText}
              noBorder
            />
          </View>
        </View>

        {/* ===== START BUTTON ===== */}
        <View className="px-6 mt-6 mb-10">
          <TouchableOpacity
            onPress={handleStartPlanning}
            className="bg-teal-600 rounded-2xl py-5 items-center"
            activeOpacity={0.9}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name="rocket" size={22} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold text-xl">
                Start Planning
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

    </View>
  );
}

/* ===== Reusable Row Component ===== */
function DetailRow({
  icon,
  iconBg,
  iconColor,
  title,
  value,
  noBorder,
}: any) {

  return (
    <View className={`mb-5 pb-5 ${noBorder ? "" : "border-b border-slate-100"}`}>
      <View className="flex-row items-center mb-2">
        <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${iconBg}`}>
          <Ionicons name={icon} size={22} color={iconColor} />
        </View>
        <Text className="text-xl font-semibold text-teal-700">
          {title}
        </Text>
      </View>
      <Text className="text-lg font-semibold text-teal-900 ml-14">
        {value}
      </Text>
    </View>
  );
}
