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
import DateTimePicker from "@react-native-community/datetimepicker";
import LottieView from "lottie-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TravelDatesScreen() {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [activeTab, setActiveTab] = useState("");
    const router = useRouter();
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const isSmall = width < 360;
    const horizontalPaddingClass = isSmall ? "px-4" : "px-6";

    const sectionTitleClass = isSmall ? "text-xl" : "text-2xl";
    const dateLabelClass = isSmall ? "text-base" : "text-lg";
    const dateValueClass = isSmall ? "text-xl" : "text-2xl";

    const headerTitleClass = isSmall ? "text-3xl" : "text-4xl";
    const headerSubtitleClass = isSmall ? "text-xl" : "text-2xl";

    const daysNumberClass = isSmall ? "text-4xl" : "text-5xl";
    const daysUnitClass = isSmall ? "text-3xl" : "text-4xl";
    const durationTitleClass = isSmall ? "text-3xl" : "text-4xl";

    const cardPaddingClass = isSmall ? "p-4" : "p-5";
    const iconBigClass = isSmall ? "w-10 h-10" : "w-12 h-12";
    const bottomIconClass = isSmall ? "w-7 h-7" : "w-8 h-8";
    const endSectionMarginBottomClass = isSmall ? "mb-12" : "mb-20";

    const chatLottie = Math.min(84, Math.max(56, Math.round(width * 0.2)));
    const { destination, budget, startingLocation } = useLocalSearchParams();
    const finalBudgetText = budget ? budget.toString() : "";

    const handleTabPress = (tab: string, route: string) => {
        setActiveTab(tab);
        router.push(route as any);
    };

    // Calculate number of days between dates (inclusive)
    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        // Reset time to midnight for accurate day calculation
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        if (end < start) return 0;

        const timeDiff = end.getTime() - start.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        // Add 1 to include both start and end days (inclusive)
        return daysDiff + 1;
    };

    const days = calculateDays();

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleStartDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowStartPicker(false);
        }
        if (event.type === "set" && selectedDate) {
            setStartDate(selectedDate);
            // If end date is before start date, update end date
            if (endDate < selectedDate) {
                setEndDate(selectedDate);
            }
        } else if (Platform.OS === "ios") {
            setShowStartPicker(false);
        }
    };

    const handleEndDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowEndPicker(false);
        }
        if (event.type === "set" && selectedDate && selectedDate >= startDate) {
            setEndDate(selectedDate);
        } else if (Platform.OS === "ios") {
            setShowEndPicker(false);
        }
    };

    const handleSubmit = () => {
        if (days === 0) return;
        const travelDates = {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            days: days,
        };

        console.log("Selected Travel Dates:", travelDates);

        // Navigate to next screen if needed
        router.push({
            pathname: "/tabs/people", params: {
                startingLocation: startingLocation, // send as param
                destination: destination, // send as param
                budget: finalBudgetText, // send as param
                travelDates: JSON.stringify(travelDates), // send as param
            },
        } as any);
    };

    const chatbotTop = Math.max(insets.top, 8) - 5;
    const chatbotLeft = Math.max(10, Math.round(width * 0.04));
    const contentPaddingTop = chatbotTop + chatLottie + 20;
    const bottomNavHeightEstimate = isSmall ? 78 : 88;
    const contentPaddingBottom = bottomNavHeightEstimate + insets.bottom;

    return (
        <ImageBackground
            source={require("../../assets/images/budget_bg.png")}
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
                        top: chatbotTop,
                        left: chatbotLeft,
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
                    contentContainerStyle={{
                        paddingTop: contentPaddingTop,
                        paddingBottom: contentPaddingBottom,
                    }}
                >
                    {/* Header Section */}
                    <View className={`${horizontalPaddingClass} mb-6 items-center`}>
                        <Text
                            className={`${headerTitleClass} font-Lobster text-teal-900 mb-2 text-center`}
                            style={{
                                textShadowColor: "rgba(0,0,0,0.5)",
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 4,
                            }}
                        >
                            Select Travel Dates
                        </Text>
                        <Text className={`${headerSubtitleClass} font-DancingScript text-white/90 text-center`}>
                            Choose your travel start and end dates
                        </Text>
                    </View>

                    {/* Start Date Section */}
                    <View className={`${horizontalPaddingClass} mb-5`}>
                        <Text className={`${sectionTitleClass} font-Lobster text-teal-900 mb-3`}>
                            Start Date
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowStartPicker(true)}
                            className={`bg-white rounded-3xl ${cardPaddingClass}`}
                            activeOpacity={0.8}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 8,
                                elevation: 6,
                            }}
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1">
                                    <Text className={`${dateLabelClass} text-slate-600 mb-1`}>
                                        Departure Date
                                    </Text>
                                    <Text className={`${dateValueClass} font-semibold text-slate-900`}>
                                        {formatDate(startDate)}
                                    </Text>
                                </View>
                                <Image
                                    source={require("../../assets/images/airplane.png")}
                                    className={iconBigClass}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>

                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={handleStartDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* End Date Section */}
                    <View className={`${horizontalPaddingClass} ${endSectionMarginBottomClass}`}>
                        <Text className={`${sectionTitleClass} font-Lobster text-teal-900 mb-3`}>
                            End Date
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowEndPicker(true)}
                            className={`bg-white rounded-3xl ${cardPaddingClass}`}
                            activeOpacity={0.8}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 8,
                                elevation: 6,
                            }}
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1">
                                    <Text className={`${dateLabelClass} text-slate-600 mb-1`}>
                                        Return Date
                                    </Text>
                                    <Text className={`${dateValueClass} font-semibold text-slate-900`}>
                                        {formatDate(endDate)}
                                    </Text>
                                </View>
                                <Image
                                    source={require("../../assets/images/aeroplane.png")}
                                    className={iconBigClass}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>

                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={handleEndDateChange}
                                minimumDate={startDate}
                            />
                        )}
                    </View>

                    {/* Days Calculation Display */}
                    <View className={`${horizontalPaddingClass} mb-2 `}>
                        <ImageBackground
                            source={require("../../assets/images/trip_duration.png")}
                            resizeMode="cover"
                            className={`rounded-3xl ${isSmall ? "p-4" : "p-6"} overflow-hidden`}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                            }}
                        >
                            {/* Overlay for better text readability */}
                            <View className="absolute inset-0 bg-black/50 rounded-3xl" />

                            {/* Content */}
                            <View className="relative z-10">
                                <Text className={`${durationTitleClass} font-Lobster text-white mb-2 text-center`} style={{
                                    textShadowColor: 'rgba(0,0,0,1)',
                                    textShadowOffset: { width: 5, height: 4 },
                                    textShadowRadius: 4,
                                }}
                                >
                                    Trip Duration
                                </Text>
                                <Text className={`${daysNumberClass} font-bold text-white text-center mb-1`} style={{
                                    textShadowColor: 'rgba(0,0,0,1)',
                                    textShadowOffset: { width: 5, height: 4 },
                                    textShadowRadius: 4,
                                }}
                                >
                                    {days}
                                </Text>
                                <Text className={`${daysUnitClass} font-DancingScript text-white/90 text-center`} style={{
                                    textShadowColor: 'rgba(0,0,0,1)',
                                    textShadowOffset: { width: 5, height: 4 },
                                    textShadowRadius: 4,
                                }}
                                >
                                    {days === 1 ? "Day" : "Days"}
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>

                    {/* Submit Button */}
                    <View className={horizontalPaddingClass}>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className={`bg-teal-700 rounded-3xl ${cardPaddingClass} items-center`}
                            activeOpacity={0.7}
                            disabled={days === 0}
                            style={{
                                opacity: days > 0 ? 1 : 0.5,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                            }}
                        >
                            <Text className={`text-white font-bold ${isSmall ? "text-lg" : "text-xl"}`}>
                                Confirm Dates
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {/* Sticky Bottom Navigation Bar */}
                <View
                    className="absolute bottom-0 left-0 right-0 bg-slate-50 border-t border-slate-200 shadow-lg"
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
                                className={`${bottomIconClass} ${activeTab === "home" ? "opacity-100" : "opacity-50"}`}
                                resizeMode="cover"
                            />
                            <Text className={`text-xs mt-1 ${activeTab === "home" ? "text-teal-600 font-semibold" : "text-slate-500"}`}>
                                Home
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 items-center"
                            onPress={() => handleTabPress("travel", "/tabs/travel")}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={require("../../assets/images/airplane.png")}
                                className={`${bottomIconClass} ${activeTab === "travel" ? "opacity-100" : "opacity-50"}`}
                                resizeMode="cover"
                            />
                            <Text className={`text-xs mt-1 ${activeTab === "travel" ? "text-teal-600 font-semibold" : "text-slate-500"}`}>
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
                                className={`${bottomIconClass} ${activeTab === "profile" ? "opacity-100" : "opacity-50"}`}
                                resizeMode="cover"
                            />
                            <Text className={`text-xs mt-1 ${activeTab === "profile" ? "text-teal-600 font-semibold" : "text-slate-500"}`}>
                                Profile
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}