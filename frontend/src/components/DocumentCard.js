import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function DocumentCard({ 
  title, 
  subtitle, 
  authority, 
  logoUrl, 
  bgLogoUrl,
  buttonText,
  onPress
}) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-white rounded-2xl shadow-sm p-4 mr-4 flex-col overflow-hidden border border-gray-100"
      style={{ width: 280, elevation: 2 }}
    >
      {/* Faint Background Logo */}
      {bgLogoUrl ? (
        <View className="absolute right-0 bottom-0 opacity-5 w-32 h-32 justify-end items-end">
          <Image 
            source={(typeof bgLogoUrl === 'string' && bgLogoUrl.startsWith('http')) ? { uri: bgLogoUrl } : bgLogoUrl}
            className="w-full h-full"
            resizeMode="contain"
            style={{ transform: [{ translateX: 20 }, { translateY: 20 }] }}
          />
        </View>
      ) : null}
      
      {/* Top Row: Logo & Title */}
      <View className="flex-row items-center mb-3">
        <View className="bg-white rounded mr-3">
          {logoUrl ? (
            <Image 
              source={(typeof logoUrl === 'string' && logoUrl.startsWith('http')) ? { uri: logoUrl } : logoUrl}
              className="h-12 w-12"
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
            />
          ) : null}
        </View>
        <View className="flex-1 justify-center">
          <Text className="font-bold text-gray-800 text-[16px]">{title}</Text>
          {subtitle ? (
             <Text className="text-gray-500 text-[13px]">{subtitle}</Text>
          ) : null}
        </View>
      </View>

      {/* Authority Text */}
      <Text className="text-[13px] text-gray-600 mb-3">
        {authority}
      </Text>

      {/* Optional Action Button */}
      {buttonText ? (
        <View className="mt-2">
          <View className="bg-[#4a2bcf] rounded-full py-3 items-center justify-center">
            <Text className="text-white font-bold text-[14px]">{buttonText}</Text>
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
