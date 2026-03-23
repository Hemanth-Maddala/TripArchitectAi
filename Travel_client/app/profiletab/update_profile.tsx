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

const BASE_URL = "http://172.25.3.173:3000";

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
    async function loadCurrent() {

      const email = await AsyncStorage.getItem("userEmail");
      if (!email) return;

      try {
        const res = await fetch(
          `${BASE_URL}/user/userdetails?Email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: { "content-type": "application/json" },
          }
        );

        const data = await res.json();

        if (res.ok && data?.details) {
          setDetails({
            Email: data.details.Email ?? "",
            Username: data.details.Username ?? "",
            Password: "",
          });
        }

      } catch (error) {
        showToast("Could not load profile");
      }
    }

    loadCurrent();
  }, []);

  const verify = async () => {

    if (!verification.trim()) {
      showToast("Enter your password");
      return;
    }

    const email = await AsyncStorage.getItem("userEmail");

    setVerifying(true);

    try {

      const res = await fetch(`${BASE_URL}/user/verifyforupdate`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: verification.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setVerified(true);
      } else {
        showToast(data.msg || "Wrong password");
      }

    } catch (error) {
      showToast("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const update = async () => {

    if (!verified) {
      showToast("Verify your password first");
      return;
    }

    setLoading(true);

    try {

      const oldEmail = await AsyncStorage.getItem("userEmail");

      const bodyData: UpdateBody = {
        oldEmail: oldEmail,
        newEmail: details.Email.trim(),
        Username: details.Username.trim(),
      };

      // send password only if user typed it
      if (details.Password && details.Password.trim() !== "") {
        bodyData.Password = details.Password.trim();
      }

      const res = await fetch(`${BASE_URL}/user/updateprofile`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok && data.success) {

        if (oldEmail !== details.Email.trim()) {
          await AsyncStorage.setItem("userEmail", details.Email.trim());
        }

        showToast("Profile updated");

        router.replace("/tabs/profile");

      } else {
        showToast(data.msg || "Update failed");
      }

    } catch (error) {
      showToast("Update failed");
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