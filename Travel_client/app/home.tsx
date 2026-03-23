import { Text, View, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const lottieSize = Math.min(170, Math.round(width * 0.32));
  const narrow = width < 380;

  return (
    <View className="flex-1 items-center justify-center bg-white">

      <Image
        source={require("./../assets/images/login_bg.png")}
        className="w-full h-full absolute"
        resizeMode="cover"
      />

      <View className="absolute inset-0 bg-black/10" />

      <Text className={`${narrow ? "text-3xl" : "text-4xl"} text-white mt-5 font-DancingScript`}>
        Welcome to
      </Text>

      <Text className={`${narrow ? "text-5xl" : "text-6xl"} text-teal-950 text-center mb-7 font-Lobster`}>
        TripArchitect AI
      </Text>

      <Text className={`${narrow ? "text-2xl" : "text-3xl"} text-white text-center mb-7 font-DancingScript px-2`}>
        We help to organize and manage trips
      </Text>



      <TouchableOpacity activeOpacity={0.7} className="bg-teal-700 px-6 py-3 rounded-lg mb-50" onPress={() => router.push('/login')}>
        <Text className="text-white text-lg font-semibold">Start Planning</Text>
      </TouchableOpacity>

      <View
      >
        <LottieView
          source={require("../assets/animations/Live_chatbot.json")}
          autoPlay
          loop
          style={{ width: lottieSize, height: lottieSize }}
        />
      </View>

    </View>
  );
}
