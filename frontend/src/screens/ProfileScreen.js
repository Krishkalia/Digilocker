import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser } = useContext(AuthContext);
  const { width: screenWidth } = Dimensions.get('window');
  const [uploading, setUploading] = useState(false);

  const API_URL = 'https://digilocker-z2jm.onrender.com/api'; 

  const pickImage = async () => {
    try {
      // Ask for permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission required", "You need to grant permission to access your photos.");
        return;
      }

      // Launch Image Picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        uploadImage(result.assets[0]);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const uploadImage = async (imageAsset) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePhoto', {
        uri: imageAsset.uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await axios.put(`${API_URL}/auth/profile-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.user) {
        await updateUser(response.data.user);
        Alert.alert("Success", "Profile photo updated successfully!");
      }
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      Alert.alert("Error", "Failed to update profile photo.");
    } finally {
      setUploading(false);
    }
  };

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
          {/* Avatar with White Border & Edit Overlay */}
          <View className="relative mb-3">
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={pickImage}
              className="w-32 h-32 rounded-full border-[5px] border-white overflow-hidden bg-gray-200 shadow-sm"
            >
              <Image 
                source={{ uri: user?.profilePhotoUrl ? user.profilePhotoUrl : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
                className="w-full h-full"
                resizeMode="cover"
              />
              {uploading ? (
                <View className="absolute inset-0 bg-black/40 justify-center items-center">
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              ) : null}
            </TouchableOpacity>
            {/* Edit Icon Badge */}
            <View className="absolute bottom-1 right-1 bg-[#3838D9] w-8 h-8 rounded-full border-2 border-white justify-center items-center shadow-sm pointer-events-none">
              <FontAwesome5 name="camera" size={12} color="white" />
            </View>
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
