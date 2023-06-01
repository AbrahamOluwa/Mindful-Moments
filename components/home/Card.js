import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = ({ title, isFocused }) => {
  const cardStyle = isFocused ? styles.focusedCard : styles.card;

  return (
    <View style={cardStyle}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
};

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: 'gray',
//     borderRadius: 8,
//     padding: 16,
//     margin: 8,
//     width: 100,
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   focusedCard: {
//     backgroundColor: 'gray',
//     borderRadius: 8,
//     padding: 16,
//     margin: 8,
//     width: 180,
//     height: 280,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

const styles = StyleSheet.create({
    card: {
      backgroundColor: 'red',
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 4,
    //   width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    focusedCard: {
      backgroundColor: 'red',
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 4,
    //   width: 200,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff'
    },
  });
  

export default Card;
