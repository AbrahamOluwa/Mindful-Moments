import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NativeBaseProvider, extendTheme } from "native-base";
import Home from "./screens/Home";
import { useCallback } from "react";
import Cat from "./components/home/Cat";
import Categories from "./components/home/Categories";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Meditations from "./screens/Meditations";
import Goals from "./screens/Goals";
import BottomTabs from "./components/navigation/BottomTabs";

const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};
const theme = extendTheme({ colors: newColorTheme });

const Stack = createNativeStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'SoraExtraLight': require('./assets/fonts/Sora/Sora-ExtraLight.ttf'),
    'SoraLight': require('./assets/fonts/Sora/Sora-Light.ttf'),
    'SoraMedium': require('./assets/fonts/Sora/Sora-Medium.ttf'),
    'SoraRegular': require('./assets/fonts/Sora/Sora-Regular.ttf'),
    'PassionOneRegular': require('./assets/fonts/Passion_One/PassionOne-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <NativeBaseProvider theme={theme}>
      {/* <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View> */}

      <NavigationContainer onLayout={onLayoutRootView}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={BottomTabs} />
          {/* <Stack.Screen name="Meditation" component={Meditations} />
          <Stack.Screen name="Goals" component={Goals} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
