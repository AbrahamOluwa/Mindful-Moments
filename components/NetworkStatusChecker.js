import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";

export default function NetworkStatusChecker() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    // <View style={styles.container}>
    //   <Text>
    //     {isConnected
    //       ? "Internet Connection is Good"
    //       : "No Internet Connection. Please check your network settings."}
    //   </Text>
    // </View>

    // <View style={styles.container}>
    //   {isConnected ? null : (
    //     <Animatable.View
    //       animation="slideInDown"
    //       duration={500}
    //       style={styles.redBackground}
    //     >
    //       <Text style={styles.message}>
    //         No Internet Connection. Please check your network settings.
    //       </Text>
    //     </Animatable.View>
    //   )}
    //   <NetworkStatusChecker />
    // </View>
    <SafeAreaView>
         <View style={styles.container}>
        {!isConnected && (
          <Animatable.View
            animation="slideInDown" // Add slide-in animation
            duration={500} // Animation duration in milliseconds
            style={[styles.redBackground, styles.messageContainer]}
          >
            <Text style={styles.message}>
              No Internet Connection. Please check your network settings.
            </Text>
          </Animatable.View>
        )}
      </View>
    </SafeAreaView>
    
     
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  redBackground: {
    backgroundColor: "red",
    padding: 10,
  },
 
  message: {
    color: "white",
    fontFamily: 'SoraMedium'
  },
});
