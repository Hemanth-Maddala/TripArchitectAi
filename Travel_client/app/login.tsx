import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ToastAndroid } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    console.log("Login attempted:", { email, password });

    if (!email || !password) {
      ToastAndroid.show("Email and Password required", ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await fetch(
        "https://triparchitectai.onrender.com/user/userlogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: email,
            Password: password,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch (err) {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        console.log("Login failed:", data);

        ToastAndroid.show(
          data?.msg || "Invalid email or password",
          ToastAndroid.SHORT
        );
        return;
      }

      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userId", data?.user?._id || "");

      ToastAndroid.show("Login Successful 🎉", ToastAndroid.SHORT);

      router.push({
        pathname: "/tabs/home_screen",
        params: { email },
      });

    } catch (error) {
      console.log("Login error:", error);
      ToastAndroid.show(
        "Server is waking up... try again",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      {/* 1. MOVE IMAGE HERE: This makes it a true background for the whole screen */}
      <Image
        source={require("./../assets/images/login_bg.png")}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/10" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center" // Ensures content stays centered even if screen is tall
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. REMOVE THE IMAGE FROM HERE */}
        <View className="items-center justify-center px-6 py-10">

          <View className="w-full max-w-md bg-white/80 rounded-2xl p-8 shadow-2xl">
            <Text className="text-4xl font-Lobster text-slate-900 mb-2 text-center">
              Welcome Back
            </Text>

            <Text className="text-2xl text-slate-500 text-center mb-8 font-DancingScript">
              Login to continue your journey
            </Text>

            {/* Inputs */}
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 text-base">Email</Text>
              <TextInput
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-6">
              <Text className="text-slate-700 font-semibold mb-2 text-base">Password</Text>
              <TextInput
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="w-full bg-teal-600 py-4 rounded-lg mb-4 shadow-lg"
              onPress={handleLogin}
              activeOpacity={0.7}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Login
              </Text>
            </TouchableOpacity>
            <View className="flex-row justify-center">
              <Text className="text-slate-700 text-2xl font-DancingScript">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text className="text-teal-600 text-2xl font-semibold font-DancingScript">Sign Up</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}