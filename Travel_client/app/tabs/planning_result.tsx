import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  useWindowDimensions,
  ToastAndroid
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import Highlights from "./highlights";
import Itinerary from "./itinerary";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlanningResultScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmall = width < 360;

  const bottomNavHeightEstimate = isSmall ? 78 : 88;
  const contentPaddingBottom = bottomNavHeightEstimate + insets.bottom;
  const bottomIconClass = isSmall ? "w-7 h-7" : "w-8 h-8";

  const { startingLocation, destination, budget, travelDates, people } =
    useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState<any>(null);
  const [hotelsData, setHotelsData] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>({});
  const [event, setEvent] = useState<any>({});
  const [saved, setsaved] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("home");

  const BASE_URL = "https://triparchitectai.onrender.com";
  const handleTabPress = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route as any);
  };

  const getMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
    });
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const parsedDates = JSON.parse(travelDates as string);

        // ================= AI PLAN =================
        let data_det;

        try {
          const response = await fetch(`${BASE_URL}/api/ai/generate-text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              destination_input: destination,
              starting_location: startingLocation || "Delhi",
              budget_input: Number(budget),
              travel_dates: travelDates,
              members: Number(people),
              month_input: getMonth(new Date(parsedDates.startDate)),
            }),
          });

          if (!response.ok) {
            throw new Error("AI request failed");
          }

          data_det = await response.json();

          setPlanData(data_det);
          setWeather(data_det?.weather);
          setEvent(data_det?.event);

        } catch (err) {
          console.log("AI error:", err);
          throw new Error("AI service unavailable");
        }

        // ================= HOTELS =================
        let formattedHotels = [];

        try {
          const place = String(destination);
          const guests = Number(people) || 2;

          const hotelRes = await fetch(
            `${BASE_URL}/api/hotels/search?place=${encodeURIComponent(place)}&guests=${guests}`
          );

          if (!hotelRes.ok) throw new Error("Failed to fetch hotels");

          const hotelJson = await hotelRes.json();
          const hoteldata = hotelJson?.hotels || [];

          formattedHotels = hoteldata.map((hotel: any) => ({
            ...hotel,
            image: hotel.image
              ? hotel.image.replace("square60", "square300")
              : null,
          }));

          setHotelsData(formattedHotels);

        } catch (err) {
          console.log("Hotels error:", err);
        }

        // ================= SAVE TRIP =================
        try {
          const userId = await AsyncStorage.getItem("userId");

          if (userId && data_det) {
            await fetch(`${BASE_URL}/trip/savetrip`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                StartingLocation: {
                  starting_location: data_det?.starting_location,
                  budget_input: data_det?.budget_input,
                  travel_dates: data_det?.travel_dates,
                  members: data_det?.members,
                },
                DestinationLocation: destination,
                HighlightDetails: data_det?.highlight_images,
                Itinerary: data_det?.itinerary,
                HotelsData: formattedHotels,
                Weather: data_det?.weather,
                Event: data_det?.event,
              }),
            });
          }

        } catch (err) {
          console.log("Save trip error:", err);
        }

      } catch (error) {
        console.log("Main flow error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const destinationLabel =
    typeof destination === "string" && destination.trim().length > 0
      ? destination
      : "your destination";

  const currentCondition = weather?.raw_current?.weather?.[0];

  const weatherIconUrl =
    currentCondition?.icon
      ? `https://openweathermap.org/img/wn/${currentCondition.icon}@2x.png`
      : null;

  const handleHotelsPress = () => {
    router.push({
      pathname: "/tabs/hotels",
      params: {
        hotelsData: JSON.stringify(hotelsData),
        destinationState: planData?.destination_data?.state || "Unknown",
        destinationInput: planData?.destination_input || "Unknown",
      },
    });
  };

  // Save Functionality //
  const savefunc = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (userId) {
        const response = await fetch(`${BASE_URL}/like/saveliked`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            userId,
            StartingLocation: {
              starting_location: planData?.starting_location,
              budget_input: planData?.budget_input,
              travel_dates: planData?.travel_dates,
              members: planData?.members,
            },
            DestinationLocation: destination,
            HighlightDetails: planData?.highlight_images,
            Itinerary: planData?.itinerary,
            HotelsData: hotelsData,
            Weather: planData?.weather,
            Event: planData?.event,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setsaved(true);
          setSavedId(data?.data?._id);
          ToastAndroid.show("Your trip saved", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.log("Error saving liked trip:", error);
    }
  };

  // Unsave Functionality
  const unsavefunc = async () => {
    try {
      if (!savedId)
        ToastAndroid.show("Try Later", ToastAndroid.SHORT);
      const res = await fetch(
        `${BASE_URL}/like/unsaveTrip/${savedId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setsaved(false);
        setSavedId(null);
        ToastAndroid.show("Trip Unsaved ", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("Error", error)
    }
  }

  // ========= MAP ROUTE =========
  const map = () => {
    router.push({
      pathname: "/tabs/maps",
      params: {
        destination: destination,
        startingLocation: startingLocation
      },
    } as any);
  }

  // ========= LOADING =========
  if (isLoading) {
    return (
      <ImageBackground
        source={require("../../assets/images/planning_bg.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="absolute inset-0 bg-black/10" />
        <View className="flex-1 justify-center items-center px-6">
          <LottieView
            source={require("../../assets/animations/animated.json")}
            autoPlay
            loop
            style={{ width: width, height: height * 0.38 }}
          />
          <Text className="text-3xl font-Lobster text-white mt-4">
            Planning Your Trip...
          </Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
      >
        {/* Header */}

        <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0f766e" />
          </TouchableOpacity>

          <Text className="text-2xl font-Lobster text-teal-900">
            <Ionicons name="sparkles" size={22} color="#f59e0b" />
            Your Plan
          </Text>

          <View className="flex-row gap-2">
            <TouchableOpacity onPress={saved ? unsavefunc : savefunc}>
              <Ionicons name={saved ? "heart" : "heart-outline"} size={30} color="#880E4F" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate("/tabs/profile")}>
              <Image
                source={require("../../assets/images/boy.png")}
                className="w-10 h-10 rounded-full"
                resizeMode="cover"
                style={{
                  borderWidth: 4,
                  borderColor: "#ffffff",
                }}
              />
            </TouchableOpacity>
          </View>

        </View>

        {/* Hero */}

        <View className="relative h-56 mx-4 mb-6">
          <ImageBackground
            source={require("../../assets/images/bg_details.png")}
            resizeMode="cover"
            className="w-full h-full rounded-3xl overflow-hidden"
          >
            {/* Overlay */}
            <View className="absolute inset-0 bg-teal-900/50" />

            {/* Center Content */}
            <View className="flex-1 items-center justify-center px-6">

              <Text
                className="text-4xl text-white font-Lobster text-center mb-2"
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.75)",
                  textShadowOffset: { width: -4, height: 2 },
                  textShadowRadius: 10,
                }}
              >
                {planData?.destination_input || "Your Destination"}
              </Text>

              <Text className="text-lg text-white/90 text-center font-semibold mb-4">
                Your Perfect Trip Awaits
              </Text>

              <TouchableOpacity
                className="bg-teal-500 px-6 py-3 rounded-lg shadow-lg"
                onPress={map}
              >
                <Text className="text-white font-semibold text-base">
                  Map View
                </Text>
              </TouchableOpacity>

            </View>
          </ImageBackground>
        </View>

        {/* Highlights */}

        {planData?.highlight_images && (
          <Highlights
            highlights={planData.highlight_images}
            destinationState={planData?.destination_data?.state}
            destinationInput={planData?.destination_input}
          />
        )}

        {/* Itinerary */}

        {planData?.itinerary && (
          <Itinerary
            itinerary={planData.itinerary}
            destinationState={planData?.destination_data?.state}
            destinationInput={planData?.destination_input}
          />
        )}

        {/* ================= HOTELS ================= */}
        <View className="px-4 mb-5">
          <View
            className="bg-white rounded-3xl p-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.18,
              shadowRadius: 14,
              elevation: 10,
            }}
          >
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-2xl items-center justify-center mr-3 bg-slate-50">
                <Ionicons name="bed" size={24} color="#D81B60" />
              </View>

              <View className="flex-1">
                <Text className="text-2xl font-Lobster text-teal-900">
                  Explore Hotels
                </Text>
              </View>

              <TouchableOpacity onPress={handleHotelsPress}>
                <FontAwesome name="arrow-right" size={18} color="#0f766e" />
              </TouchableOpacity>
            </View>
            {hotelsData && hotelsData.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-4"
              >
                <View className="flex-row gap-4 pr-2">
                  {hotelsData.slice(0, 4).map((hotel: any) => (
                    <TouchableOpacity
                      key={hotel.id}
                      onPress={handleHotelsPress}
                      className="w-64 bg-white rounded-3xl overflow-hidden border border-slate-100"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.12,
                        shadowRadius: 8,
                        elevation: 6,
                      }}
                    >

                      <View className="h-44 bg-slate-200">
                        {hotel.image && (
                          <ImageBackground
                            source={{ uri: hotel.image }}
                            resizeMode="cover"
                            className="w-full h-full"
                          >
                            <View className="absolute inset-0 bg-black/15" />

                            <View className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-full">
                              <Text className="text-sm font-bold text-teal-900">
                                ₹{hotel.price
                                  ? hotel.price.toLocaleString()
                                  : "N/A"}
                              </Text>
                            </View>
                          </ImageBackground>
                        )}
                      </View>

                      <View className="px-4 py-3">
                        <Text
                          className="text-base font-semibold text-pink-900"
                          numberOfLines={2}
                        >
                          {hotel.name || "Unnamed Hotel"}
                        </Text>

                        <View className="flex-row items-center mt-1.5">
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color="#0f766e"
                          />
                          <Text
                            className="text-xs font-medium text-slate-600 ml-1"
                            numberOfLines={1}
                          >
                            {hotel.city || planData?.destination_input} •{" "}
                            {hotel.type || "Hotel"}
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-3">
                          <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="#f59e0b" />
                            <Text className="text-xs text-slate-700 ml-1 font-semibold">
                              {hotel.rating
                                ? `${hotel.rating} ${hotel.ratingText || ""}`
                                : "New listing"}
                            </Text>
                          </View>

                          <View className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200">
                            <Text className="text-[11px] text-sky-700 font-semibold">
                              {hotel.type || "Hotel"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text className="text-sm text-slate-500 mt-3">
                We are finding the best stays for you...
              </Text>
            )}

            <View className="bg-teal-50 rounded-2xl px-4 py-3 mt-4 border border-teal-100">
              <View className="flex-row items-center">
                <Ionicons
                  name="information-circle"
                  size={18}
                  color="#0f766e"
                />
                <Text className="text-sm font-semibold text-teal-900 ml-2 flex-1">
                  Handpicked stays & hotels near your destination
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* WEATHER */}

        <View className="px-4 mb-5">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/tabs/weather_details" as any,
                params: {
                  destination: destinationLabel,
                  travelDates:
                    typeof travelDates === "string" ? travelDates : "",
                  weather: JSON.stringify(weather),
                },
              })
            }
            className="bg-white rounded-3xl overflow-hidden border border-slate-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 14,
              elevation: 10,
            }}
          >
            <View className="px-5 pt-5 pb-4 bg-sky-600">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-semibold text-white uppercase tracking-[1.4px]">
                    Weather Details
                  </Text>

                  <Text className="text-3xl font-Lobster text-amber-500 mt-1">
                    {destinationLabel}
                  </Text>
                </View>

                <View className="items-end">
                  <View className="bg-amber-100 border border-white/20 px-3 py-1 rounded-full">
                    <Text className="text-green-900 text-[11px] font-semibold">
                      {currentCondition?.main || "Weather"}
                    </Text>
                  </View>

                  {weatherIconUrl ? (
                    <Image
                      source={{ uri: weatherIconUrl }}
                      style={{ width: 54, height: 54, marginTop: 8 }}
                    />
                  ) : (
                    <Ionicons
                      name="cloud-outline"
                      size={30}
                      color="#ffffff"
                    />
                  )}
                </View>
              </View>
            </View>

            <View className="px-5 py-4">
              <Text
                className="text-slate-700 text-sm leading-5"
                numberOfLines={3}
              >
                {weather?.current_weather}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* EVENTS */}

        <View className="px-4 mb-8">
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
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-amber-100">
                <Ionicons name="sparkles" size={22} color="#f59e0b" />
              </View>

              <Text className="text-2xl font-Lobster text-pink-900 flex-1">
                Seasonal Events
              </Text>

              <FontAwesome
                name="arrow-right"
                size={20}
                color="#14b8a6"
                onPress={() =>
                  router.push({
                    pathname: "/tabs/event_details" as any,
                    params: {
                      events: JSON.stringify(event),
                      destinationInput: destinationLabel,
                    },
                  })
                }
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-4">
                {Object.entries(event).map(([title, data]: any) => (
                  <View
                    key={title}
                    className="w-36 rounded-2xl bg-white"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.12,
                      shadowRadius: 6,
                      elevation: 5,
                    }}
                  >
                    <View>
                      <Image
                        source={{ uri: data?.image_url?.image_url }}
                        className="w-36 h-40"
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      {/* Bottom Navigation Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-slate-200"
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
              className={`${bottomIconClass} ${activeTab === "home" ? "opacity-100" : "opacity-40"}`}
              resizeMode="cover"
            />
            <Text
              className={`text-xs mt-1 ${activeTab === "home" ? "text-teal-600 font-semibold" : "text-slate-500"}`}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 items-center"
            onPress={() => handleTabPress("travel", "/tabs/home_screen")}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/images/airplane.png")}
              className={`${bottomIconClass} ${activeTab === "travel" ? "opacity-100" : "opacity-40"}`}
              resizeMode="cover"
            />
            <Text
              className={`text-xs mt-1 ${activeTab === "travel" ? "text-teal-600 font-semibold" : "text-slate-500"}`}
            >
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
              className={`${bottomIconClass} ${activeTab === "profile" ? "opacity-100" : "opacity-40"}`}
              resizeMode="cover"
            />
            <Text
              className={`text-xs mt-1 ${activeTab === "profile" ? "text-teal-600 font-semibold" : "text-slate-500"}`}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
