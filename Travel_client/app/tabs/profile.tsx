import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
    type UserDetails = {
        Username: string;
        Email: string;
    };
    const [activeTab, setActiveTab] = useState("profile");
    const [details, setdetails] = useState<UserDetails | null>(null);
    const router = useRouter();
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const isSmall = width < 360;

    const bottomNavHeightEstimate = isSmall ? 78 : 88;
    const bottomIconClass = isSmall ? "w-7 h-7" : "w-8 h-8";
    // Extra padding because there is also an absolute "Log Out" button above the bottom bar.
    const contentPaddingBottom = bottomNavHeightEstimate + insets.bottom + 40;
    const logOutBottomOffset = bottomNavHeightEstimate + 10 + insets.bottom;
    const horizontalPaddingClass = isSmall ? "px-4" : "px-6";
    const profileCardPaddingClass = isSmall ? "p-5" : "p-6";
    const avatarSizeClass = isSmall ? "w-28 h-28" : "w-32 h-32";
    const userNameClass = isSmall ? "text-2xl" : "text-3xl";
    const menuIconClass = isSmall ? "w-9 h-9 mr-3" : "w-10 h-10 mr-4";

    const handleTabPress = (tab: string, route: string) => {
        setActiveTab(tab);
        router.push(route as any);
    };

    const menuItems = [
        {
            id: "password",
            label: "Update Profile",
            icon: "lock-closed",
            iconColor: "#14b8a6",
            onPress: () => { router.push("/profiletab/update_profile") },
        },
        {
            id: "saved",
            label: "Saved Plans",
            icon: "bookmark",
            iconColor: "#fbbf24",
            onPress: () => { router.push("/profiletab/saved") },
        },
        {
            id: "history",
            label: "Trip History",
            icon: "clipboard",
            iconColor: "#fbbf24",
            onPress: () => {
                router.push({
                    pathname: "/profiletab/trip-historydet",
                    params: {
                        tab: "profile",
                    },
                });
            },
        },
        {
            id: "support",
            label: "Customer Support",
            icon: "help-circle",
            iconColor: "#14b8a6",
            onPress: () => { router.push("/profiletab/customer") },
        },
    ];

    useEffect(() => {
        async function det() {
            let email = await AsyncStorage.getItem("userEmail");
            const res = await fetch(`http://172.25.0.52:3000/user/userdetails?Email=${email}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })

            const data = await res.json();
            setdetails(data.details);
        }
        det();
    }, [])

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
            >
                {/* Header */}
                <View className={`flex-row items-center justify-between ${horizontalPaddingClass} pt-12 pb-4`}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#0f766e" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-Lobster text-teal-900">
                        <Ionicons name="sparkles" size={22} color="#f59e0b" />
                        Profile
                    </Text>
                    <View>
                        <Image
                            source={require("../../assets/images/boy.png")}
                            className="w-8 h-8 rounded-full"
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Background Section with Travel Theme */}
                <View className="relative h-48">
                    <ImageBackground
                        source={require("../../assets/images/login_bg.png")}
                        resizeMode="cover"
                        className="w-full h-full"
                    >
                        {/* Overlay for better visibility */}
                        <View className="absolute inset-0 bg-teal-50/30" />
                    </ImageBackground>
                </View>

                {/* Profile Card */}
                <View className={`${horizontalPaddingClass} -mt-24`}>
                    <View
                        className={`bg-white rounded-3xl ${profileCardPaddingClass}`}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 8,
                        }}
                    >
                        {/* Profile Picture */}
                        <View className="items-center -mt-16 mb-4">
                            {/* <View className="relative"> */}
                            <View>
                                <Image
                                    source={require("../../assets/images/boy.png")}
                                    className={`${avatarSizeClass} rounded-full`}
                                    resizeMode="cover"
                                    style={{
                                        borderWidth: 4,
                                        borderColor: "#ffffff",
                                    }}
                                />
                            </View>
                        </View>

                        {/* User Name */}
                        <Text className={`${userNameClass} font-Lobster text-teal-900 text-center mb-2`}>
                            {details?.Username}
                        </Text>

                        {/* Email */}
                        <Text className="text-base text-slate-600 text-center mb-6">
                            {details?.Email}
                        </Text>

                        <View className="bg-amber-50 rounded-xl p-3 mt-2 flex-row items-center">
                            <Ionicons name="information-circle-outline" size={18} color="#fbbf24" />
                            <Text className="text-sm text-amber-800 ml-2 flex-1">
                                Your profile is here . You can access all the sections mentioned below
                            </Text>
                        </View>

                        {/* Menu Items */}
                        <View className="mt-8">
                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={item.onPress}
                                    className={`flex-row items-center justify-between py-4 ${index < menuItems.length - 1 ? "border-b border-slate-100" : ""
                                        }`}
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View
                                            className={`${menuIconClass} rounded-xl items-center justify-center`}
                                            style={{ backgroundColor: `${item.iconColor}20` }}
                                        >
                                            <Ionicons
                                                name={item.icon as any}
                                                size={22}
                                                color={item.iconColor}
                                            />
                                        </View>
                                        <Text className="text-base font-semibold text-slate-800">
                                            {item.label}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color="#94a3b8"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Log Out Button */}
            <View
                className={`absolute left-0 right-0 ${horizontalPaddingClass}`}
                style={{ bottom: logOutBottomOffset }}
            >
                <TouchableOpacity
                    className="bg-teal-600 rounded-2xl py-4 items-center"
                    activeOpacity={0.8}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                    onPress={() => {
                        console.log("Log Out");
                        router.push("/home");
                    }}
                >
                    <Text className="text-white font-bold text-lg">
                        + Log Out
                    </Text>
                </TouchableOpacity>
            </View>

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
