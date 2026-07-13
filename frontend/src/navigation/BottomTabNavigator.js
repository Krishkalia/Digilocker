import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import IssuedDocumentsScreen from '../screens/IssuedDocumentsScreen';
import MenuScreen from '../screens/MenuScreen';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="flex-row bg-white border-t border-gray-200 items-center px-2 shadow-lg elevation-10"
      style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 10, paddingTop: 10, paddingRight: 80 }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = '';
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Search') iconName = 'search';
        else if (route.name === 'Issued') iconName = 'award';
        else if (route.name === 'Menu') iconName = 'user';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center pt-2"
          >
            <View>
              <FontAwesome5 
                name={iconName} 
                size={20} 
                color={isFocused ? '#4a2bcf' : '#6b7280'} 
                solid={isFocused || route.name === 'Home'} // FontAwesome 5 solid state
              />
              {/* Notification dot for Issued */}
              {route.name === 'Issued' && (
                <View className="absolute -top-1 -right-2 h-2.5 w-2.5 rounded-full bg-red-500 border border-white" />
              )}
            </View>
            <Text 
              className={`text-[9px] mt-1 ${isFocused ? 'text-[#4a2bcf] font-bold' : 'text-gray-500'}`}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* UMANG Floating Tab Button - Outside of standard routes */}
      <TouchableOpacity 
        className="absolute right-0 bg-[#e97818] w-20 h-14 rounded-tl-3xl items-center justify-center shadow-md elevation-5"
        style={{ 
           bottom: insets.bottom > 0 ? insets.bottom : 0,
           shadowColor: '#e96b1f', 
           shadowOffset: { width: 0, height: -2 }, 
           shadowOpacity: 0.2, 
           shadowRadius: 4,
           zIndex: 10
        }}
      >
        <Text className="text-white text-[11px] font-bold tracking-wider">UMANG</Text>
      </TouchableOpacity>

    </View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Issued" component={IssuedDocumentsScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
    </Tab.Navigator>
  );
}
