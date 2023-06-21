import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NativeBaseProvider, extendTheme } from "native-base";
import Home from "./screens/Home";
import { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Meditations from "./screens/Meditations";
import Goals from "./screens/Goals";
import Topics from "./screens/Topics";
import BottomTabs from "./components/navigation/BottomTabs";
import { registerRootComponent } from 'expo';
import Articles from "./screens/Articles.js";
import SelectedTopic from "./screens/SelectedTopic.js";
import SelectedSubtopic from "./screens/SelectedSubtopic.js";
import MeditationPlayer from "./screens/MeditationPlayer.js";
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import Journal from "./screens/Journal.js";
import WriteJournalEntry from "./screens/WriteJournalEntry.js";
import AllJournalEntries from "./screens/AllJournalEntries.js";
import Gratitude from "./screens/Gratitude.js";
import RecordGratitudeMoment from "./screens/RecordGratitudeMoment.js";
import AllGratitudeMoments from "./screens/AllGratitudeMoments.js";
import SetGoals from "./screens/SetGoals.js";
import GoalsList from "./screens/GoalsList.js";
import UserAuthentication from "./screens/UserAuthentication.js";
// import TrackPlayer from 'react-native-track-player';


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
    'SoraSemiBold': require('./assets/fonts/Sora/Sora-SemiBold.ttf'),
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
          <Stack.Screen name="HomeScreen" component={BottomTabs} />
          <Stack.Screen name="ArticlesScreen" component={Articles} />
          <Stack.Screen name="TopicsScreen" component={Topics} />
          <Stack.Screen name="GoalsScreen" component={Goals} />
          <Stack.Screen name="SelectedTopicScreen" component={SelectedTopic} />
          <Stack.Screen name="SelectedSubtopicScreen" component={SelectedSubtopic} />
          <Stack.Screen name="MeditationsScreen" component={Meditations} />
          <Stack.Screen name="MeditationPlayerScreen" component={MeditationPlayer} />
          <Stack.Screen name="JournalScreen" component={Journal} />
          <Stack.Screen name="WriteJournalEntryScreen" component={WriteJournalEntry} />
          <Stack.Screen name="AllJournalEntriesScreen" component={AllJournalEntries} />
          <Stack.Screen name="GratitudeScreen" component={Gratitude} />
          <Stack.Screen name="RecordGratitudeMomentScreen" component={RecordGratitudeMoment} />
          <Stack.Screen name="AllGratitudeMomentsScreen" component={AllGratitudeMoments} />
          <Stack.Screen name="SetGoalsScreen" component={SetGoals} />
          <Stack.Screen name="GoalsListScreen" component={GoalsList} />
          <Stack.Screen name="UserAuthenticationScreen" component={UserAuthentication} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
registerRootComponent(App);
// AppRegistry.registerComponent(appName, () => App);
// TrackPlayer.registerPlaybackService(() => require('./utilsAndServices/TrackPlayerService'));


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
