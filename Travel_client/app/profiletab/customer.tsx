import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    View,
  Image,
  useWindowDimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://172.25.0.52:3000";

export default function CustomerSupportScreen() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
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

    const showMessage = (msg: string) => {
        if (Platform.OS === "android") {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
            Alert.alert("Support Center", msg);
        }
    };

    const sendMail = async () => {
        try {
            const fromEmail = await AsyncStorage.getItem("userEmail");

            if (!fromEmail) {
                showMessage("Please login to send a support request.");
                return;
            }

            if (!subject.trim() || !message.trim()) {
                showMessage("Please fill in both subject and message.");
                return;
            }

            setSending(true);

            const res = await fetch(`${BASE_URL}/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: fromEmail,
                    subject: subject.trim(),
                    message: message.trim(),
                }),
            });

            const data = await res.json().catch(() => null);

            if (res.ok && data?.success) {
                setSubject("");
                setMessage("");
                showMessage("Message sent! We'll reply to your email soon. ✅");
                setTimeout(() => router.back(), 2000);
            } else {
                showMessage(data?.msg || "Server error. Please try again later.");
            }
        } catch (err) {
            showMessage("Connection failed. Is your server running?");
        } finally {
            setSending(false);
        }
    };

    return (
        <View style={{ flex: 1 }} className="bg-slate-50">
            {/* HEADER */}
            <View className="bg-white border-b border-slate-200">
                <View className="flex-row items-center justify-between px-5 pt-14 pb-5">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-2xl bg-slate-100 items-center justify-center"
                    >
                        <Ionicons name="chevron-back" size={24} color="#0f766e" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-Lobster text-teal-900">
                        <Ionicons name="sparkles" size={22} color="#f59e0b" />
                        Customer Support
                    </Text>
                    <View className="w-10" />
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
                >
                    {/* INSTRUCTION CARD */}
                    <View className="bg-yellow-500 rounded-3xl p-6 mt-6 shadow-lg shadow-teal-200">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="bulb-sharp" size={24} color="#D32F2F" />
                            <Text className="text-black font-bold ml-2 text-xl">How can we help?</Text>
                        </View>
                        <Text className="text-teal-50 text-[13px] leading-5">
                            Welcome to Triparchitect AI Support. You can use this form to:
                        </Text>
                        <View className="mt-3">
                            <Text className="text-emerald-950 text-sm mb-1">• Report a bug in the AI trip generator.</Text>
                            <Text className="text-emerald-950 text-sm mb-1">• Request modifications of app.</Text>
                            <Text className="text-emerald-950 text-sm">• Ask questions about your account.</Text>
                        </View>
                    </View>

                    {/* THE FORM */}
                    <View className="mt-8">
                        <Text className="text-slate-500 font-bold text-sm uppercase tracking-widest ml-1 mb-2">
                            Contact Form
                        </Text>

                        <View className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                            <Text className="text-slate-800 font-semibold mb-2">Subject</Text>
                            <TextInput
                                value={subject}
                                onChangeText={setSubject}
                                placeholder="e.g., Bug in Trip Plan / Account Issue"
                                placeholderTextColor="#cbd5e1"
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 mb-4"
                            />

                            <Text className="text-slate-800 font-semibold mb-2">Detailed Message</Text>
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Describe your issue in detail..."
                                placeholderTextColor="#cbd5e1"
                                multiline
                                numberOfLines={6}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900"
                                style={{ textAlignVertical: "top", minHeight: 120 }}
                            />

                            <TouchableOpacity
                                onPress={sendMail}
                                disabled={sending}
                                className={`mt-6 rounded-2xl py-4 items-center justify-center flex-row ${sending ? "bg-slate-300" : "bg-teal-600"
                                    }`}
                            >
                                {sending ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Text className="text-white font-bold text-base mr-2">Send Request</Text>
                                        <Ionicons name="paper-plane" size={18} color="white" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* FOOTER INFO */}
                    <View className="mt-8 items-center">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="time-outline" size={16} color="#94a3b8" />
                            <Text className="text-slate-400 text-xs ml-1">
                                Typical response time: Within 24 hours
                            </Text>
                        </View>
                        <Text className="text-slate-400 text-xs text-center px-10">
                            Your message will be sent directly to the Triparchitect developer team.
                        </Text>
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