import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { NativeBaseProvider, extendTheme } from "native-base";
// import { GluestackUIProvider } from "@gluestack-ui/themed";
// import { config } from "@gluestack-ui/config";
import store from "./redux/store";
import Home from "./screens/Home";
import { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Meditations from "./screens/Meditations";
import Goals from "./screens/Goals";
import Topics from "./screens/Topics";
import BottomTabs from "./components/navigation/BottomTabs";
import { registerRootComponent } from "expo";
import Articles from "./screens/Articles.js";
import SelectedTopic from "./screens/SelectedTopic.js";
import SelectedSubtopic from "./screens/SelectedSubtopic.js";
import MeditationPlayer from "./screens/MeditationPlayer.js";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import Journal from "./screens/Journal.js";
import WriteJournalEntry from "./screens/WriteJournalEntry.js";
import AllJournalEntries from "./screens/AllJournalEntries.js";
import Gratitude from "./screens/Gratitude.js";
import RecordGratitudeMoment from "./screens/RecordGratitudeMoment.js";
import AllGratitudeMoments from "./screens/AllGratitudeMoments.js";
import SetGoals from "./screens/SetGoals.js";
import GoalsList from "./screens/GoalsList.js";
import UserAuthentication from "./screens/UserAuthentication.js";
import EditJournalEntry from "./screens/EditJournalEntry.js";
import EditGratitudeMoment from "./screens/EditGratitudeMoment.js";
import UploadCourses from "./screens/UploadCourses.js";
import EditGoal from "./screens/EditGoal.js";
// import NetworkStatusChecker from "./components/NetworkStatusChecker";
import UploadArticles from "./screens/UploadArticles.js";
import SignUp from "./screens/SignUp.js";
import NewHome from "./screens/NewHome.js";
import NewMeditation from "./screens/NewMeditation.js";
import NewThoughts from "./screens/NewThoughts.js";
import Paths from "./screens/Paths.js";
import SignIn from "./screens/SignIn.js";
import { AuthProvider } from "./context/AuthContext";
import { AudioProvider, AudioContext } from "./context/AudioContext";
import MinimizedPlayer from "./components/meditations/MinimizedPlayer";
import EntryScreen from './screens/EntryScreen.js';
import CreateGoal from "./screens/CreateGoal.js";
import GoalDetails from "./screens/GoalDetails.js";
import Terms from "./screens/Terms.js";
import Profile from "./screens/Profile.js";
import OnboardingQuestionnaire from "./screens/OnboardingQuestionnaire.js";
import PathOverview from "./screens/PathOverview.js";
import DailyPath from "./screens/DailyPath.js";
import WeekView from "./screens/WeekView.js";
import ItemDetail from "./screens/ItemDetail.js"
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

//firebase.initializeApp(firebaseConfig);

export default function App() {
  const [fontsLoaded] = useFonts({
    SoraExtraLight: require("./assets/fonts/Sora/Sora-ExtraLight.ttf"),
    SoraLight: require("./assets/fonts/Sora/Sora-Light.ttf"),
    SoraMedium: require("./assets/fonts/Sora/Sora-Medium.ttf"),
    SoraRegular: require("./assets/fonts/Sora/Sora-Regular.ttf"),
    SoraSemiBold: require("./assets/fonts/Sora/Sora-SemiBold.ttf"),
    PassionOneRegular: require("./assets/fonts/Passion_One/PassionOne-Regular.ttf"),
    PoppinsRegular: require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsMedium: require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    PoppinsBold: require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
    RobotoSlabRegular: require("./assets/fonts/Roboto_Slab/static/RobotoSlab-Regular.ttf"),
    RobotoSlabSemiBold: require("./assets/fonts/Roboto_Slab/static/RobotoSlab-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // const { isMeditationPlaying } = React.useContext(AudioContext);

  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        {/* <GluestackUIProvider config={config}> */}
        {/* <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View> */}
        {/* <NetworkStatusChecker /> */}
        <AuthProvider>
          <AudioProvider>
            <NavigationContainer onLayout={onLayoutRootView}>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
              
                <Stack.Screen name="SignInScreen" component={SignIn} />
                <Stack.Screen name="SignUpScreen" component={SignUp} />
                <Stack.Screen name="HomeScreen" component={BottomTabs} />
                <Stack.Screen name="ArticlesScreen" component={Articles} />
                <Stack.Screen name="TopicsScreen" component={Topics} />
                <Stack.Screen name="GoalsScreen" component={Goals} />
                <Stack.Screen
                  name="SelectedTopicScreen"
                  component={SelectedTopic}
                />
                <Stack.Screen
                  name="SelectedSubtopicScreen"
                  component={SelectedSubtopic}
                />
                <Stack.Screen
                  name="MeditationsScreen"
                  component={Meditations}
                />
                <Stack.Screen
                  name="MeditationPlayerScreen"
                  component={MeditationPlayer}
                />
                <Stack.Screen name="JournalScreen" component={Journal} />
                <Stack.Screen
                  name="WriteJournalEntryScreen"
                  component={WriteJournalEntry}
                />
                <Stack.Screen
                  name="AllJournalEntriesScreen"
                  component={AllJournalEntries}
                />
                <Stack.Screen
                  name="EditJournalEntryScreen"
                  component={EditJournalEntry}
                />
                <Stack.Screen name="GratitudeScreen" component={Gratitude} />
                <Stack.Screen
                  name="RecordGratitudeMomentScreen"
                  component={RecordGratitudeMoment}
                />
                <Stack.Screen
                  name="AllGratitudeMomentsScreen"
                  component={AllGratitudeMoments}
                />
                <Stack.Screen
                  name="EditGratitudeMomentScreen"
                  component={EditGratitudeMoment}
                />
                <Stack.Screen name="SetGoalsScreen" component={SetGoals} />
                <Stack.Screen name="GoalsListScreen" component={GoalsList} />
                <Stack.Screen name="EditGoalScreen" component={EditGoal} />
                <Stack.Screen
                  name="UserAuthenticationScreen"
                  component={UserAuthentication}
                />
                <Stack.Screen
                  name="UploadCourseScreen"
                  component={UploadCourses}
                />
                <Stack.Screen
                  name="UploadArticlesScreen"
                  component={UploadArticles}
                />
                <Stack.Screen name="NewHomeScreen" component={BottomTabs} />
                <Stack.Screen
                  name="NewMeditationScreen"
                  component={NewMeditation}
                />
                <Stack.Screen
                  name="NewThoughtsScreen"
                  component={NewThoughts}
                />
                <Stack.Screen name="PathsScreen" component={Paths} />
                <Stack.Screen name="EntryScreen" component={EntryScreen} />
                <Stack.Screen name="CreateGoalScreen" component={CreateGoal} />
                <Stack.Screen name="GoalDetailsScreen" component={GoalDetails} />
                <Stack.Screen name="TermsScreen" component={Terms} />
                <Stack.Screen name="ProfileScreen" component={Profile} />
                <Stack.Screen name="OnboardingQuestionnaireScreen" component= {OnboardingQuestionnaire} /> 
                <Stack.Screen name="PathOverviewScreen" component= {PathOverview} />
                <Stack.Screen name="DailyPathScreen" component= {DailyPath} />
                <Stack.Screen name="WeekViewScreen" component= {WeekView} />
                <Stack.Screen name="ItemDetailScreen" component= {ItemDetail} />
              </Stack.Navigator>
              {/* <MinimizedPlayer /> */}
            </NavigationContainer>
          </AudioProvider>
        </AuthProvider>
        {/* </GluestackUIProvider> */}
      </NativeBaseProvider>
    </Provider>
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
