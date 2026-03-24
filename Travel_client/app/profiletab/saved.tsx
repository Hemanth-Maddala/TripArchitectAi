import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  useWindowDimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Saved = {
  _id: string;
  StartingLocation?: any;
  DestinationLocation?: string;
  createdAt?: string;
};

const BASE_URL = "https://triparchitectai.onrender.com";

export default function TripHistoryScreen() {
  const router = useRouter();

  const [saved, setSaved] = useState<Saved[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmall = width < 360;
  const bottomNavHeightEstimate = isSmall ? 78 : 88;
  const contentPaddingBottom = bottomNavHeightEstimate + insets.bottom;
  const bottomIconClass = isSmall ? "w-7 h-7" : "w-8 h-8";

  const handleTabPress = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route as any);
  };

  useEffect(() => {
    const getTrips = async () => {
      try {
        setLoading(true);

        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          console.log("No userId found");
          setSaved([]);
          return;
        }

        const res = await fetch(
          `${BASE_URL}/like/getliked/${encodeURIComponent(userId)}`
        );

        let data;
        try {
          data = await res.json();
        } catch (err) {
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          console.log("Fetch failed:", data);
          return;
        }
        const trips = Array.isArray(data?.data) ? data.data : [];

        setSaved(trips);

        console.log("Trips:", trips);

      } catch (err) {
        console.log("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    };

    getTrips();
  }, []);

  const handleDeleteTrip = (tripId: string) => {
    if (!tripId) return;

    Alert.alert("Unsave Trip", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Unsave",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `${BASE_URL}/like/unsaveTrip/${encodeURIComponent(tripId)}`,
              {
                method: "DELETE",
              }
            );

            let data;
            try {
              data = await res.json();
            } catch {
              data = null;
            }

            if (!res.ok) {
              console.log("Delete failed:", data);
              throw new Error("Delete failed");
            }
            setSaved((prev) => prev.filter((t) => t._id !== tripId));

          } catch (err) {
            console.log("Delete error:", err);

            Alert.alert(
              "Error",
              "Failed to unsave trip. Please try again."
            );
          }
        },
      },
    ]);
  };

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

          <View className="items-center">
            <Text className="text-2xl font-Lobster text-teal-900">
              <Ionicons name="sparkles" size={22} color="#f59e0b" />
              Saved Trips
            </Text>
            <Text className="text-xs text-blue-900 mt-1">
              Review and reopen your saved adventures
            </Text>
          </View>

          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
      >
        {loading && (
          <View className="mt-10 items-center">
            <ActivityIndicator size="large" color="#0f766e" />
            <Text className="mt-3 text-slate-500 text-sm">
              Fetching your trips...
            </Text>
          </View>
        )}

        {!loading && saved.length === 0 && (
          <View className="items-center mt-20">
            <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
              <Ionicons name="airplane-outline" size={32} color="#94a3b8" />
            </View>
            <Text className="text-base font-semibold text-slate-700">
              No trips yet
            </Text>
            <Text className="text-gray-500 mt-2 text-center px-6 text-sm">
              Your future adventures will appear here once you start planning.
            </Text>
          </View>
        )}

        {!loading &&
          saved.map((trip) => {
            const start = trip.StartingLocation?.starting_location;
            const budget = trip.StartingLocation?.budget_input;
            const members = trip.StartingLocation?.members;
            const destination = trip.DestinationLocation;
            const created = trip?.createdAt;

            let dates = "";

            try {
              const travel = JSON.parse(
                trip.StartingLocation?.travel_dates || "{}"
              );
              if (travel.startDate && travel.endDate) {
                dates = `${travel.startDate} - ${travel.endDate}`;
              }
            } catch { }

            const routeLabel =
              start && destination ? `${start} ➜ ${destination}` : "Trip";

            let createdLabel = "";
            if (created) {
              try {
                const d = new Date(created);
                createdLabel = d.toDateString();
              } catch {
                createdLabel = created;
              }
            }

            const onPressTrip = () => {
              try {
                router.push({
                  pathname: "/profiletab/saved_details",
                  params: { saveId: trip._id }
                });
              } catch (e) {
                console.log("Failed to encode trip details", e);
              }
            };

            return (
              <View
                key={trip._id}
                className="bg-white rounded-3xl p-5 mb-4 border border-slate-100"
                style={{
                  position: "relative",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                {/* Main card press area */}
                <TouchableOpacity
                  onPress={onPressTrip}
                  activeOpacity={0.85}
                  className="flex-1"
                >
                  {/* Top row: route and chevron */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1 pr-3">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="location-outline"
                          size={22}
                          color="#0f766e"
                        />
                        <Text
                          numberOfLines={2}
                          className="text-lg font-semibold ml-2 text-pink-900"
                        >
                          {routeLabel}
                        </Text>
                      </View>
                    </View>

                    {/* <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="black"
                    /> */}
                  </View>

                  {/* Dates pill */}
                  {dates ? (
                    <View className="self-start mb-3 px-1 py-1.5 flex-row items-center">
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#4b5563"
                      />
                      <Text className="text-sm text-gray-800 ml-1.5">
                        {dates}
                      </Text>
                    </View>
                  ) : null}

                  {/* Meta row */}
                  <View className="flex-row mt-1">
                    <View className="flex-row px-1 items-center mr-4">
                      <Ionicons
                        name="people-outline"
                        size={18}
                        color="#4b5563"
                      />
                      <Text className="text-sm text-gray-800 ml-1.5">
                        {members ?? "—"} members
                      </Text>
                    </View>

                    <View className="flex-row items-center mr-4">
                      <Ionicons
                        name="cash-outline"
                        size={18}
                        color="#4b5563"
                      />
                      <Text className="text-xs text-gray-800 ml-1.5">
                        ₹{budget ?? "—"}
                      </Text>
                    </View>
                  </View>

                  {/* Created at */}
                  {createdLabel ? (
                    <View className="mt-3 px-1 flex-row items-center">
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color="#FF6F00"
                      />
                      <Text className="ml-1.5 text-[12px] text-black font-bold">
                        Planned on {createdLabel}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>

                {/* Delete button */}
                <TouchableOpacity
                  onPress={() => handleDeleteTrip(trip._id)}
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-red-50 items-center justify-center"
                  hitSlop={10}
                >
                  <Ionicons
                    name="heart"
                    size={20}
                    color="#ef4444"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
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
              className={`${bottomIconClass} ${activeTab === "home" ? "opacity-100" : "opacity-40"
                }`}
              resizeMode="cover"
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

          <TouchableOpacity
            className="flex-1 items-center"
            onPress={() => handleTabPress("travel", "/tabs/home_screen")}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/images/airplane.png")}
              className={`${bottomIconClass} ${activeTab === "travel" ? "opacity-100" : "opacity-40"
                }`}
              resizeMode="cover"
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

          <TouchableOpacity
            className="flex-1 items-center"
            onPress={() => handleTabPress("profile", "/tabs/profile")}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/images/boy.png")}
              className={`${bottomIconClass} ${activeTab === "profile" ? "opacity-100" : "opacity-40"
                }`}
              resizeMode="cover"
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
    </View>
  );
}