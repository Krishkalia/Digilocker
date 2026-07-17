import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
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

        let IconComponent = FontAwesome5;
        let iconName = '';
        let IconSize = 22;

        if (route.name === 'Home') {
          // Custom Home Icon will be handled inside the return
        } else if (route.name === 'Search') {
          IconComponent = Feather;
          iconName = 'search';
        } else if (route.name === 'Issued') {
          IconComponent = Ionicons;
          iconName = 'ribbon-outline';
          IconSize = 24;
        } else if (route.name === 'Menu') {
          IconComponent = Feather;
          iconName = 'user';
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center pt-2 pb-1"
          >
            <View className="items-center justify-center h-7 mb-1">
              {route.name === 'Home' ? (
                <View className="relative justify-center items-center">
                  <FontAwesome5 name="file" size={22} color={isFocused ? '#3a00e5' : '#6b7280'} solid />
                  <View className="absolute top-[8px] items-center justify-center">
                    <FontAwesome5 name="cloud" size={12} color="white" solid />
                    <View className="absolute w-[2px] h-[5px] rounded-full mt-0.5" style={{ backgroundColor: isFocused ? '#3a00e5' : '#6b7280' }} />
                  </View>
                </View>
              ) : (
                <IconComponent 
                  name={iconName} 
                  size={IconSize} 
                  color={isFocused ? '#3a00e5' : '#6b7280'} 
                />
              )}
            </View>
            <Text 
              className={`text-[11px] ${isFocused ? 'text-[#3a00e5] font-bold' : 'text-gray-500 font-medium'}`}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* UMANG Floating Tab Button */}
      <TouchableOpacity 
        className="absolute right-0 bg-[#e97818] px-4 py-2.5 rounded-l-xl items-center justify-center shadow-sm"
        style={{ 
           bottom: (insets.bottom > 0 ? insets.bottom : 0) + 12,
           elevation: 3,
           zIndex: 10
        }}
      >
        <Text className="text-white text-[13px] font-bold tracking-wide">UMANG</Text>
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
