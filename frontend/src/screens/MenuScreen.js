import React, { useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const MenuItem = ({ icon, label, isLast, onPress, color = "#3838D9", textColor = "text-gray-700" }) => (
  <TouchableOpacity onPress={onPress} className={`flex-row items-center py-4 px-2 ${!isLast ? 'border-b border-gray-100' : ''}`}>
    <View className="w-8 items-center justify-center mr-3">
      <FontAwesome5 name={icon} size={18} color={color} />
    </View>
    <Text className={`text-[16px] flex-1 ${textColor}`}>{label}</Text>
  </TouchableOpacity>
);

export default function MenuScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5 pt-8" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile')}
          className="flex-row items-center p-4 border border-gray-200 rounded-xl mb-6"
        >
          <View className="h-14 w-14 rounded-xl overflow-hidden bg-gray-200 mr-4">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZl2UCyUrgfkHyjEmAsTb664W_sBnMy6dD_ivbmPCLFI_yKJGT3EMeioF1zSDPJdwLhsGKPX5WfvXFn42utlbpTb8BtDy5NPi8yF7LiqpS2e9byFOTTtaE7fGNoOZZ55Ac4pU8mC9pNabHJzVpoZS93beTcVJtPr8wyScUA1QFVs_l-fGktX4A3V3is0onVV3agRa-Umrjo-1y08fATGSD1ty7Wjwr3Wl79DOXZhKdmoyFlEoN4Tx203x7hdaZtXtDfPjxnObmEyJf' }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 justify-center">
            <Text className="text-[18px] text-gray-800 font-medium mb-1">
              {user?.username ? user.username : 'Krish Kalia'}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-[14px] text-gray-600 mr-1">Verified</Text>
              <FontAwesome5 name="check-circle" size={12} color="#10b981" solid />
            </View>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#4b5563" />
        </TouchableOpacity>

        {/* First Menu Group */}
        <View className="border border-gray-200 rounded-xl px-2 mb-6">
          <MenuItem icon="hdd" label="Drive" />
          <MenuItem icon="user" label="My Account" />
          <MenuItem icon="user-plus" label="Nominee" />
          <MenuItem icon="cog" label="Settings" isLast />
        </View>

        {/* Second Menu Group */}
        <View className="border border-gray-200 rounded-xl px-2 mb-6">
          <MenuItem icon="qrcode" label="Scan QR" />
          <MenuItem icon="chart-line" label="My Activity" isLast />
        </View>

        {/* Third Menu Group */}
        <View className="border border-gray-200 rounded-xl px-2 mb-6">
          <MenuItem icon="question-circle" label="Help" />
          <MenuItem icon="info-circle" label="About" isLast />
        </View>

        {/* Fourth Menu Group (Account Actions) */}
        <View className="border border-gray-200 rounded-xl px-2 mb-8">
          <MenuItem icon="exchange-alt" label="Switch Account" />
          <MenuItem 
            icon="sign-out-alt" 
            label="Logout" 
            color="#b91c1c" 
            textColor="text-red-700"
            onPress={logout}
            isLast 
          />
        </View>

        {/* App Version */}
        <View className="items-center mb-6">
          <Text className="text-gray-500 text-[13px] tracking-wide">APP VERSION 9.4.0</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
