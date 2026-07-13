import React, { useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { width: screenWidth } = Dimensions.get('window');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        
        {/* Blue Header Section */}
        <View className="bg-[#3838D9] pt-12 pb-6 px-5 z-10 relative">
          <View className="flex-row justify-between items-center z-10">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                <FontAwesome5 name="arrow-left" size={20} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-[20px] font-bold">My Profile</Text>
            </View>
            <TouchableOpacity>
              <FontAwesome5 name="share-alt" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Slanted Edge Background */}
        <View style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: screenWidth,
          borderTopWidth: 50,
          borderLeftColor: 'transparent',
          borderTopColor: '#3838D9',
          zIndex: 1
        }} />

        {/* Profile Avatar & Info Section */}
        <View className="items-center -mt-24 z-20 px-5">
          {/* Avatar with White Border */}
          <View className="w-32 h-32 rounded-full border-[5px] border-white overflow-hidden bg-gray-200 shadow-sm mb-3">
            <Image 
              source={{ uri: user?.profilePhotoUrl ? user.profilePhotoUrl : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          
          {/* Name & Badge */}
          <View className="flex-row items-center mb-3">
            <Text className="text-[26px] font-bold text-gray-800 mr-2">
              {user?.username ? user.username : 'Krish Kalia'}
            </Text>
            <FontAwesome5 name="check-circle" size={20} color="#10b981" solid />
          </View>

          {/* VCard Button */}
          <TouchableOpacity className="bg-[#e0f2fe] px-5 py-2 rounded-full flex-row items-center mb-8">
            <Text className="text-gray-700 text-[13px] font-medium mr-2">Generate VCard</Text>
            <FontAwesome5 name="qrcode" size={14} color="#374151" />
          </TouchableOpacity>

          {/* Details Card */}
          <View className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ elevation: 2 }}>
            
            <View className="flex-row py-5 px-5 border-b border-gray-100">
              <Text className="w-24 font-bold text-gray-900 text-[15px]">DOB</Text>
              <Text className="flex-1 text-gray-600 text-[15px]">
                {user?.dob ? new Date(user.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : 'Not Provided'}
              </Text>
            </View>

            <View className="flex-row py-5 px-5 border-b border-gray-100">
              <Text className="w-24 font-bold text-gray-900 text-[15px]">Gender</Text>
              <Text className="flex-1 text-gray-600 text-[15px]">{user?.gender || 'Not Provided'}</Text>
            </View>

            <View className="flex-row py-5 px-5 border-b border-gray-100 items-center">
              <Text className="w-24 font-bold text-gray-900 text-[15px]">Mobile</Text>
              <Text className="flex-1 text-gray-600 text-[15px]">{user?.phoneNumber || 'Not Provided'}</Text>
              <TouchableOpacity>
                <FontAwesome5 name="edit" size={14} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row py-5 px-5 items-center">
              <Text className="w-24 font-bold text-gray-900 text-[15px]">Email</Text>
              <View className="flex-1">
                <Text className="text-gray-600 text-[15px]">{user?.email || 'Not Provided'}</Text>
              </View>
              <TouchableOpacity className="mr-3">
                <FontAwesome5 name="exclamation-triangle" size={14} color="#f59e0b" />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome5 name="edit" size={14} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
          </View>

          {/* Quick Links Header */}
          <View className="w-full mt-6 px-1">
            <Text className="text-gray-800 text-[16px] font-bold">Quick Links</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
