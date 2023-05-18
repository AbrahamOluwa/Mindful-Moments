import React, {useState} from 'react'
import { View, useWindowDimensions, Text } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';



const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#ff4081' }}>
        <Text>Hello</Text>
    </View>
  );
  
  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
  );
  
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });



export default function Categories1() {
 
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(1);
    const [routes] = useState([
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
    ]);
  
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    );
}