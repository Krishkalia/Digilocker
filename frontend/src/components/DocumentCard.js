import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function DocumentCard({ 
  title, 
  subtitle, 
  authority, 
  logoUrl, 
  bgLogoUrl,
  onPress
}) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-white rounded-2xl shadow-md p-4 mb-6 flex-row items-start overflow-hidden"
    >
      {/* Faint Background Logo */}
      {bgLogoUrl ? (
        <View className="absolute -right-5 -bottom-5 opacity-5">
          <Image 
            source={{ uri: bgLogoUrl }}
            className="w-32 h-32 rounded-full"
          />
        </View>
      ) : null}
      
      {/* Card Content */}
      <View className="bg-white p-1 rounded mr-4">
        {logoUrl ? (
          <Image 
            source={{ uri: logoUrl }}
            className="h-10 w-10"
            resizeMode="contain"
          />
        ) : null}
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-800 text-base">{title}</Text>
        <Text className="text-gray-500 text-sm mb-2 font-mono">{subtitle}</Text>
        <Text className="text-xs text-gray-500 leading-tight">
          {authority}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
