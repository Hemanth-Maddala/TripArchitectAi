import "../global.css";
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {

  const [loaded] = useFonts({
              DancingScript: require("../assets/fonts/DancingScript-VariableFont_wght.ttf"), // This key name is what matters
              Lobster: require("../assets/fonts/Lobster-Regular.ttf"),
            });
  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
    <Stack>
      <Stack.Screen name="home" options={{ title: 'Home', headerShown: false }}/>
      <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }}/>
      <Stack.Screen name="signup" options={{ title: 'Sign Up', headerShown: false }}/>
      <Stack.Screen name="tabs/home_screen" options={{ headerShown: false }}/>
      <Stack.Screen name="tabs/budget" options={{ title: 'Budget', headerShown: false }}/>
      <Stack.Screen name="tabs/travel_dates" options={{ title: 'Travel Dates', headerShown: false }}/>
      <Stack.Screen name="tabs/people" options={{ title: 'People', headerShown: false }}/>
      <Stack.Screen name="tabs/profile" options={{ title: 'Profile', headerShown: false }}/>
      <Stack.Screen name="tabs/planning" options={{ title: 'Planning', headerShown: false }}/>
      <Stack.Screen name="tabs/planning_result" options={{ title: 'Planning Result', headerShown: false }}/>
      <Stack.Screen name="tabs/highlights" options={{ title: 'Highlights', headerShown: false }}/>
      <Stack.Screen name="tabs/highlight_details" options={{ title: 'Highlight Details', headerShown: false }}/>
      <Stack.Screen name="tabs/itinerary_details" options={{ title: 'Travel', headerShown: false }}/>
      <Stack.Screen name="tabs/hotels" options={{ title: 'Hotels', headerShown: false }}/>
      <Stack.Screen name="tabs/hotel_details" options={{ title: 'Hotel Details', headerShown: false }}/>
      <Stack.Screen name="tabs/weather_details" options={{ title: 'Weather Details', headerShown: false }}/> 
      <Stack.Screen name="tabs/event_details" options={{ title: 'Event Details', headerShown: false }}/>       
      <Stack.Screen name="profiletab/update_profile" options={{ title: 'Update profile ', headerShown: false }}/>       
      <Stack.Screen name="profiletab/trip-historydet" options={{ title: 'Trip History ', headerShown: false }}/>       
      <Stack.Screen name="profiletab/trip_details" options={{ title: 'Trip details ', headerShown: false }}/> 
      <Stack.Screen name="profiletab/saved" options={{ title: 'Saved ', headerShown: false }}/> 
      <Stack.Screen name="profiletab/saved_details" options={{ title: 'Saved details ', headerShown: false }}/> 
      <Stack.Screen name="profiletab/customer" options={{ title: 'Customer Support ', headerShown: false }}/>       
      <Stack.Screen name="tabs/maps" options={{ title: 'Maps View ', headerShown: false }}/>         
    </Stack>
    </SafeAreaProvider>
  );
}