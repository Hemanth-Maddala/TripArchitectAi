import { Text, View, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ToastAndroid } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    

    const handleLogin = async () => {
        console.log("Login attempted:", { username, email, password });
        const response = await fetch("http://172.25.0.52:3000/user/useraccount", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                Username: username,
                Email: email,
                Password: password
            })
        });
        const data = await response.json();
        if (response.ok) {
            await AsyncStorage.setItem("userEmail", email);
            await AsyncStorage.setItem("userId", data?.user?._id);
            router.push({
                pathname: "/tabs/home_screen",
                params: {
                    email
                },
            } as any);
        } else {
            ToastAndroid.show("Enter valid details or Unique Email", ToastAndroid.SHORT);
            return;
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
                            Join Us
                        </Text>

                        <Text className="text-2xl text-slate-500 text-center mb-8 font-DancingScript">
                            Sign in to start your journey
                        </Text>

                        {/* Inputs */}
                        <View className="mb-4">
                            <Text className="text-slate-700 font-semibold mb-2 text-base">Username</Text>
                            <TextInput
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-900"
                                placeholder="Enter your username"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>

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
                                Sign-In
                            </Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center">
                            <Text className="text-slate-700 text-2xl font-DancingScript">Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text className="text-teal-600 text-2xl font-semibold font-DancingScript">Login</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}