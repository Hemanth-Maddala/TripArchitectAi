import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ToastAndroid,
  Image,
  useWindowDimensions
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type UserDetails = {
  Email: string;
  Username: string;
  Password: string;
};

type UpdateBody = {
  oldEmail: string | null;
  newEmail: string;
  Username: string;
  Password?: string;
};

const BASE_URL = "https://triparchitectai.onrender.com";

function showToast(message: string) {
  if (Platform.OS === "android" && ToastAndroid) {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

export default function UpdateProfileScreen() {

  const [verification, setVerification] = useState("");
  const [verified, setVerified] = useState(false);
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

  const [details, setDetails] = useState<UserDetails>({
    Email: "",
    Username: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const loadCurrent = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");

        if (!email) {
          console.log("No email found in storage");
          return;
        }

        const res = await fetch(
          `${BASE_URL}/user/userdetails?Email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        let data;
        try {
          data = await res.json();
        } catch (err) {
          throw new Error("Invalid server response");
        }

        if (!res.ok) {
          console.log("Fetch failed:", data);
          showToast("Failed to load profile");
          return;
        }

        if (data?.details) {
          setDetails({
            Email: data.details.Email ?? "",
            Username: data.details.Username ?? "",
            Password: "",
          });
        } else {
          console.log("No user details found");
        }

      } catch (error) {
        console.log("Profile load error:", error);
        showToast("Server is waking up... try again");
      }
    };

    loadCurrent();
  }, []);

  const verify = async () => {
    if (!verification.trim()) {
      showToast("Enter your password");
      return;
    }

    try {
      const email = await AsyncStorage.getItem("userEmail");

      if (!email) {
        showToast("User not found. Please login again.");
        return;
      }

      setVerifying(true);

      const res = await fetch(`${BASE_URL}/user/verifyforupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: verification.trim(),
        }),
      });

      let data;

      try {
        data = await res.json();
      } catch (err) {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        console.log("Verify failed:", data);
        showToast(data?.msg || "Verification failed");
        return;
      }

      if (data?.success) {
        setVerified(true);
        showToast("Verified successfully ✅");
      } else {
        showToast(data?.msg || "Wrong password");
      }

    } catch (error) {
      console.log("Verification error:", error);
      showToast("Server is waking up... try again");
    } finally {
      setVerifying(false);
    }
  };

  const update = async () => {
    if (!verified) {
      showToast("Verify your password first");
      return;
    }

    if (loading) return;

    try {
      const oldEmail = await AsyncStorage.getItem("userEmail");

      if (!oldEmail) {
        showToast("Session expired. Please login again.");
        return;
      }

      const newEmail = details.Email?.trim() || "";
      const username = details.Username?.trim() || "";

      if (!newEmail || !username) {
        showToast("Email and Username are required");
        return;
      }

      setLoading(true);

      const password = details.Password?.trim();

      const bodyData: UpdateBody = {
        oldEmail,
        newEmail,
        Username: username,
        ...(password ? { Password: password } : {}),
      };

      // ✅ include password only if provided
      if (details.Password && details.Password.trim() !== "") {
        bodyData.Password = details.Password.trim();
      }

      const res = await fetch(`${BASE_URL}/user/updateprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        console.log("Update failed:", data);
        showToast(data?.msg || "Update failed");
        return;
      }

      if (data?.success) {
        if (oldEmail !== newEmail) {
          await AsyncStorage.setItem("userEmail", newEmail);
        }

        showToast("Profile updated successfully ✅");

        router.replace("/tabs/profile");
      } else {
        showToast(data?.msg || "Update failed");
      }

    } catch (error) {
      console.log("Update error:", error);
      showToast("Server is waking up... try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >

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
              Update Profile
            </Text>

            <View className="w-10" />

          </View>

        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: contentPaddingBottom, paddingTop: 24 }}
          keyboardShouldPersistTaps="handled"
        >

          <View className="px-4">

            {!verified ? (

              <View
                className="bg-white rounded-3xl p-6"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >

                <View className="w-12 h-12 rounded-2xl bg-teal-100 items-center justify-center mb-4">
                  <Ionicons name="lock-closed" size={24} color="#0f766e" />
                </View>

                <Text className="text-lg font-bold text-amber-900 mb-1">
                  Verify your identity
                </Text>

                <Text className="text-sm text-amber-700 mb-5">
                  Enter your current password to edit your profile.
                </Text>

                <TextInput
                  value={verification}
                  onChangeText={setVerification}
                  placeholder="Enter password"
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-base text-slate-900"
                />

                <TouchableOpacity
                  onPress={verify}
                  disabled={verifying || !verification.trim()}
                  className="mt-5 bg-teal-600 rounded-2xl py-3.5 items-center"
                  activeOpacity={0.8}
                  style={{
                    opacity: verification.trim() && !verifying ? 1 : 0.6,
                  }}
                >

                  {verifying ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      Verify
                    </Text>
                  )}

                </TouchableOpacity>

              </View>

            ) : (

              <>
                <View className="flex-row items-center mb-5 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <Ionicons name="checkmark-circle" size={22} color="#0f766e" />
                  <Text className="text-amber-800 font-semibold ml-2">
                    Verified — update your details below
                  </Text>
                </View>

                <View
                  className="bg-white rounded-3xl p-6"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >

                  <Text className="text-base font-semibold text-red-800 mb-2">
                    Email
                  </Text>

                  <TextInput
                    value={details.Email}
                    onChangeText={(t) =>
                      setDetails((prev) => ({ ...prev, Email: t }))
                    }
                    placeholder="your@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#94a3b8"
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-base text-slate-900 mb-4"
                  />

                  <Text className="text-base font-semibold text-red-800 mb-2">
                    Username
                  </Text>

                  <TextInput
                    value={details.Username}
                    onChangeText={(t) =>
                      setDetails((prev) => ({ ...prev, Username: t }))
                    }
                    placeholder="Your name"
                    placeholderTextColor="#94a3b8"
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-base text-slate-900 mb-4"
                  />

                  <Text className="text-base font-semibold text-red-800 mb-2">
                    New password
                  </Text>

                  <TextInput
                    value={details.Password}
                    onChangeText={(t) =>
                      setDetails((prev) => ({ ...prev, Password: t }))
                    }
                    secureTextEntry
                    placeholder="Leave blank to keep current"
                    placeholderTextColor="#94a3b8"
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-base text-slate-900 mb-4"
                  />

                  <TouchableOpacity
                    onPress={update}
                    disabled={loading}
                    className="bg-teal-600 rounded-2xl py-3.5 items-center"
                    activeOpacity={0.8}
                  >

                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-bold text-base">
                        Save Changes
                      </Text>
                    )}

                  </TouchableOpacity>

                </View>
              </>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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