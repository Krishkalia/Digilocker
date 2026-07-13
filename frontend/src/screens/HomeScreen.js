import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DocumentCard from '../components/DocumentCard';
import { AuthContext } from '../context/AuthContext';

const UtilityItem = ({ icon, color, label }) => (
  <TouchableOpacity className="w-[31%] bg-gray-50 rounded-xl items-center justify-center py-4 mb-3 border border-gray-100 shadow-sm" style={{ elevation: 1 }}>
    <FontAwesome5 name={icon} size={28} color={color} className="mb-2" />
    <Text className="text-[11px] font-medium text-gray-700 text-center px-1" numberOfLines={2}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://192.168.1.5:5000/api';

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentPress = (doc) => {
    navigation.navigate('SecureViewer', { document: doc.document });
  };

  const { width: screenWidth } = Dimensions.get('window');

  // Hardcode the first document styling to perfectly match the screenshot for visual fidelity
  let featuredDoc = null;
  if (documents && documents.length > 0) {
    const doc = documents[0];
    const docName = doc?.document?.documentName || 'Aadhaar Card';
    let logoUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxbJv-DsOFG-BRJgzdkiV00fbNdVCG5YlMBVm6CVGyW0yz_2kOMwsfGRQkh5p4nBR6rEhhFX6YbuS8j_UGiPIj-z8mzmJa_fqPRxSRSoWnXPz_6SzgP0H-krGimYECyCC8UFfMAS0C8YTqSGWvR8uPIhznvhdY5F0ebC8loOC4btgjg0CrgipaZeg1CQ5y2TssJjRKh_ksUBJkIuU2q5WCU2-wbgVh1ypCQWk4UqhafSsx6Gvo30dfLHRc2qRPcKfR3c0X0H1zYDHn'; 
    let bgLogoUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfKw5FmaglRxoOMNc_BAO8OKbw4jkDaANA7DqLYwxjMKeaS9mMRudZtrvNhLw1oysrPknCLoY0qgBS2Mlz3vbIs2bQZkr4bTGQM7i_rjMCVnU7jVfbStnxegb_p04byG5NDu6IyiOIUIXJjIS8oiFWYsZrPLPaOTwlSLfGEOgfcGLk8OfBRgCPORViS0J2-B2Oy-NeveOUCyVnuXNuUW9mZSkNZ__RspRiROLmMK5AJAt58jXFTDKWYKWhtgmzTiscE91ndpDjWjVu';
    let authorityStr = "Unique Identification Authority of India (UIDAI)";

    featuredDoc = (
      <DocumentCard 
        key={doc._id}
        title={docName}
        subtitle="XXXX-XXXX-XXXX"
        authority={authorityStr}
        logoUrl={logoUrl}
        bgLogoUrl={bgLogoUrl}
        onPress={() => handleDocumentPress(doc)}
      />
    );
  } else if (!loading) {
    featuredDoc = (
      <View className="bg-white rounded-2xl shadow-md p-6 mb-6 items-center">
        <Text className="text-gray-500 italic">No documents found.</Text>
      </View>
    );
  } else {
    featuredDoc = <ActivityIndicator size="large" color="#3838D9" className="my-6" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Blue Header Section */}
        <View className="bg-[#3838D9] pt-8 pb-10 px-5 relative z-10">
          
          {/* Top Bar: Logos */}
          <View className="flex-row items-center mb-6">
            <Image 
              source={require('../../assets/Ahoka-removebg-preview.png')}
              className="h-12 w-8"
              style={{ tintColor: 'white' }}
              resizeMode="contain"
            />
            <View className="h-10 w-[1px] bg-white/40 mx-3" />
            <View className="flex-row items-center space-x-1.5">
              <View className="relative justify-center items-center h-8 w-6 mr-1 mt-1">
                <FontAwesome5 name="file" size={28} color="white" solid />
                <View className="absolute top-[10px] items-center justify-center">
                  <FontAwesome5 name="cloud" size={16} color="#3838D9" solid />
                  {/* Small Keyhole inside Cloud */}
                  <View className="absolute w-[2px] h-[6px] bg-white rounded-full mt-0.5" />
                </View>
              </View>
              <Text className="text-white text-[28px] font-bold tracking-tight">DigiLocker</Text>
            </View>
          </View>

          {/* User Welcome Row */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-[24px] font-bold flex-1">
              Welcome, {user?.username ? user.username : 'Krish Kalia'}!
            </Text>
            <View className="h-12 w-12 rounded-full overflow-hidden border-2 border-white ml-2 bg-gray-300">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZl2UCyUrgfkHyjEmAsTb664W_sBnMy6dD_ivbmPCLFI_yKJGT3EMeioF1zSDPJdwLhsGKPX5WfvXFn42utlbpTb8BtDy5NPi8yF7LiqpS2e9byFOTTtaE7fGNoOZZ55Ac4pU8mC9pNabHJzVpoZS93beTcVJtPr8wyScUA1QFVs_l-fGktX4A3V3is0onVV3agRa-Umrjo-1y08fATGSD1ty7Wjwr3Wl79DOXZhKdmoyFlEoN4Tx203x7hdaZtXtDfPjxnObmEyJf' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Subtitle */}
          <Text className="text-white text-[13px] opacity-90 leading-tight pr-10 mb-6">
            DigiLocker 'Issued Documents' are at par with original documents as per IT ACT,
          </Text>

          {/* Section Header */}
          <View className="flex-row justify-between items-center z-10">
            <Text className="text-white text-[18px] font-bold">Issued Documents</Text>
            <TouchableOpacity className="bg-white/20 py-1.5 px-3 rounded-full">
              <Text className="text-white text-[11px] font-medium">See All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* The Slanted Edge (CSS Border Triangle) */}
        <View style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: screenWidth,
          borderTopWidth: 40,
          borderLeftColor: 'transparent',
          borderTopColor: '#3838D9',
          zIndex: 10
        }} />

        {/* Floating Featured Document */}
        <View className="px-5 -mt-10 z-20">
          {featuredDoc}
        </View>

        {/* Promotional Banner Carousel */}
        <View className="mt-2 mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 20 }}
            snapToInterval={screenWidth - 40 + 16} // card width + margin
            decelerationRate="fast"
          >
            {/* UMANG Banner */}
            <View 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-row items-center p-4 mr-4 overflow-hidden" 
              style={{ width: screenWidth - 40, height: 140, elevation: 2 }}
            >
              {/* Background Circular Patterns */}
              <View className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5">
                <View className="absolute right-[-40px] top-[-20px] w-48 h-48 rounded-full border-[10px] border-[#0e3b6e]" />
                <View className="absolute right-[-20px] top-[0px] w-40 h-40 rounded-full border-[8px] border-[#0e3b6e]" />
              </View>

              <View className="w-[60%] z-10">
                <Text className="text-[#10438a] font-bold text-[14px] mb-1">Access UMANG in DigiLocker</Text>
                <Text className="text-gray-500 text-[11px] leading-snug mb-3 pr-2">
                  Your one-stop destination for all Government services.
                </Text>
                <TouchableOpacity className="bg-[#e97818] py-2 px-4 rounded-full self-start">
                  <Text className="text-white text-[12px] font-bold">Access UMANG</Text>
                </TouchableOpacity>
              </View>
              <View className="w-[40%] items-center justify-end h-full">
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr4tu47-V2U2wqg54m1xyr8tcjlhhjjItb4sgIFC366UkWQoPGu4S1ImDgUACYNUMsxSs0VUp7P7itYr9BnGcgxu2My6GY2CwIhv_QghpxtpDI-Bf-53W4dSMAqXyAc7vNFYTF5DvK4unOyxzTfRwUei92YkYtL60YpwnA18fLljKH6BXhjEaVkh7rrZOpGbanWsF76bj59lam4C1rmnZFu0GkvJatQGsAxQCd9LJk_FYwX88K17KxVLdnR-eeoXQyOug9bO3PNqUT' }}
                  className="w-[80px] h-[100px]"
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Credentials Wallet Banner */}
            <View 
              className="bg-[#ebe3ff] rounded-2xl border border-[#d8b4fe] shadow-sm flex-row items-center p-4 mr-4 overflow-hidden" 
              style={{ width: screenWidth - 40, height: 140, elevation: 2 }}
            >
              {/* Background Circular Patterns */}
              <View className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10">
                <View className="absolute right-[-40px] top-[-20px] w-48 h-48 rounded-full border-[10px] border-[#7c3aed]" />
                <View className="absolute right-[-20px] top-[0px] w-40 h-40 rounded-full border-[8px] border-[#7c3aed]" />
              </View>

              <View className="w-[55%] z-10">
                <Text className="text-[#3838D9] font-bold text-[15px] mb-1">Your Credentials Wallet</Text>
                <Text className="text-gray-600 text-[11px] leading-snug mb-3">
                  All Your Identity cards in one place
                </Text>
                <TouchableOpacity className="bg-[#3838D9] py-2 px-4 rounded-full self-start">
                  <Text className="text-white text-[12px] font-bold">View All Credentials</Text>
                </TouchableOpacity>
              </View>
              <View className="w-[45%] h-full justify-center pl-2">
                <View className="bg-[#5b21b6] w-full h-[80px] rounded-xl p-2 justify-between">
                  <View className="flex-row items-center space-x-1">
                    <FontAwesome5 name="cloud" size={10} color="white" />
                    <Text className="text-white text-[8px]">DigiLocker Verified Credential</Text>
                  </View>
                  <View>
                    <Text className="text-white/70 text-[6px]">Name</Text>
                    <Text className="text-white text-[9px] font-bold">Aman Mittal</Text>
                  </View>
                  <View>
                    <Text className="text-white/70 text-[6px]">Created on</Text>
                    <Text className="text-white text-[8px]">23/05/2024</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          
          {/* Scroll Indicators (Simulated) */}
          <View className="flex-row justify-center mt-3 space-x-2">
            <View className="h-1.5 w-1.5 rounded-full bg-[#3838D9]" />
            <View className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          </View>
        </View>

        {/* DigiLocker Utility Section */}
        <View className="px-5 mb-4">
          <Text className="text-gray-800 text-[18px] font-bold mb-4">DigiLocker Utility</Text>
          
          <View className="flex-row flex-wrap justify-between">
            <UtilityItem icon="unlock-alt" color="#3b82f6" label="Authenticator" />
            <UtilityItem icon="folder" color="#f59e0b" label="Drive" />
            <UtilityItem icon="id-badge" color="#3b82f6" label="Verifiable Credential" />
            
            <UtilityItem icon="landmark" color="#4b5563" label="Govt. Employee" />
            <UtilityItem icon="users" color="#ec4899" label="Nominee" />
            <UtilityItem icon="file-contract" color="#8b5cf6" label="My Consent" />
            
            <UtilityItem icon="clipboard-list" color="#64748b" label="My Activity" />
            <UtilityItem icon="qrcode" color="#475569" label="Scan QR" />
            <UtilityItem icon="hand-pointer" color="#e97818" label="UMANG" />
            
            <UtilityItem icon="plus-circle" color="#1d4ed8" label="ABHA" />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
