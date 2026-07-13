import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SplashScreen() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create an infinite looping animation for the loading bar
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0, // Reset instantly
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [animatedValue]);

  // Interpolate the animated value to a percentage width
  const widthInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-1 bg-[#3838D9] justify-center items-center">
      
      <View className="items-center">
        {/* Composite Logo */}
        <View className="relative justify-center items-center h-16 w-12 mb-4">
          <FontAwesome5 name="file" size={60} color="white" solid />
          <View className="absolute top-[22px] items-center justify-center">
            <FontAwesome5 name="cloud" size={34} color="#3838D9" solid />
            <View className="absolute w-[3px] h-[10px] bg-white rounded-full mt-1" />
          </View>
        </View>

        {/* Brand Text */}
        <Text className="text-white text-[32px] font-bold mb-6 tracking-tight">DigiLocker</Text>

        {/* Horizontal Loading Bar */}
        <View className="w-48 h-1.5 bg-white/30 rounded-full overflow-hidden">
          <Animated.View 
            className="h-full bg-white rounded-full"
            style={{ width: widthInterpolation }}
          />
        </View>
      </View>

      {/* Footer Text */}
      <View className="absolute bottom-16 items-center">
        <Text className="text-white/90 text-[16px] font-medium tracking-wide">Document Wallet to</Text>
        <Text className="text-white/90 text-[16px] font-medium tracking-wide">Empower Citizens</Text>
      </View>

    </View>
  );
}
