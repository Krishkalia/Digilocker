import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DocumentCard from '../components/DocumentCard';
import { AuthContext } from '../context/AuthContext';

export default function IssuedDocumentsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://digilocker-z2jm.onrender.com/api';

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Background container so white is behind the blue */}
      <View className="flex-1 bg-white">
        
        {/* Blue Header Section */}
        <View className="bg-[#3838D9] pt-12 pb-6 px-5 relative z-10">
          {/* Faint Background Logo (simulated by a large faint icon) */}
          <View className="absolute right-0 bottom-10 opacity-[0.03]">
            <FontAwesome5 name="folder-open" size={200} color="white" />
          </View>

          {/* Top Bar: Logos and Icons */}
          <View className="flex-row items-center justify-between mb-8 z-10">
            <View className="flex-row items-center space-x-3">
              <Image 
                source={require('../../assets/Ahoka-removebg-preview.png')}
                className="h-12 w-8"
                style={{ tintColor: 'white', width: 32, height: 48 }}
                resizeMode="contain"
              />
              {/* Vertical Divider */}
              <View className="h-10 w-[1px] bg-white/40 mx-2" />
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

            {/* Refresh Icon */}
            <TouchableOpacity onPress={() => fetchDocuments()}>
              <FontAwesome5 name="redo-alt" size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Title & Subtitle */}
          <View className="mb-2 z-10">
            <Text className="text-white text-[26px] font-bold mb-3 tracking-wide">Issued Documents</Text>
            <Text className="text-white text-[13px] opacity-90 leading-[20px] pr-8 font-medium">
              DigiLocker 'Issued Documents' are at par with original documents as per IT ACT, 2000
            </Text>
          </View>
        </View>
        
        {/* The Slanted Edge (CSS Border Triangle) */}
        <View style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: screenWidth,
          borderTopWidth: 50,
          borderLeftColor: 'transparent',
          borderTopColor: '#3838D9',
          zIndex: 10
        }} />

        {/* Floating Search Bar */}
        <View className="px-5 -mt-6 z-20">
          <View className="bg-white flex-row items-center rounded-full px-5 py-3.5 shadow-md border border-gray-100" style={{ elevation: 4 }}>
            <FontAwesome5 name="search" size={18} color="#6b7280" className="mr-3" />
            <Text className="text-gray-500 text-[15px] flex-1">Search for documents</Text>
          </View>
        </View>

        {/* Content Area (Document List) */}
        <View className="flex-1 px-5 pt-8 bg-white z-0">
          <Text className="text-gray-800 text-[17px] font-bold mb-4">
            My Issued Document({documents ? documents.length : 0})
          </Text>
          
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#3838D9" className="mt-10" />
            ) : documents && documents.length > 0 ? (
              documents.map((userDoc) => {
                const docName = userDoc?.document?.documentName ? userDoc.document.documentName : 'Aadhaar Card';
                
                // Use custom logo from DB if available, otherwise fallback
                let logoUrl = userDoc?.document?.logoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxbJv-DsOFG-BRJgzdkiV00fbNdVCG5YlMBVm6CVGyW0yz_2kOMwsfGRQkh5p4nBR6rEhhFX6YbuS8j_UGiPIj-z8mzmJa_fqPRxSRSoWnXPz_6SzgP0H-krGimYECyCC8UFfMAS0C8YTqSGWvR8uPIhznvhdY5F0ebC8loOC4btgjg0CrgipaZeg1CQ5y2TssJjRKh_ksUBJkIuU2q5WCU2-wbgVh1ypCQWk4UqhafSsx6Gvo30dfLHRc2qRPcKfR3c0X0H1zYDHn'; 
                let authorityStr = "Government of India";

                if (!userDoc?.document?.logoUrl) {
                  // Apply fallback specific icons if no custom logo was provided
                  if (docName.includes('APAAR')) {
                    authorityStr = "Academic Bank of Credits";
                    logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDKJXZU0PqF8zM3B3oVqj1Q_gM4C6w2zK_7s1vT9jRzD5qX_x8Z7W_QY_t_m_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N"; 
                  } else if (docName.includes('Aadhaar')) {
                    authorityStr = "Unique Identification Authority of India (UIDAI)";
                  } else if (docName.includes('Marksheet') || docName.includes('Degree')) {
                    authorityStr = "Central Board of Secondary Education";
                  }
                } else {
                  // Set generic authority based on keywords even if logo is custom
                  if (docName.includes('APAAR')) authorityStr = "Academic Bank of Credits";
                  else if (docName.includes('Aadhaar')) authorityStr = "Unique Identification Authority of India (UIDAI)";
                  else if (docName.includes('Marksheet') || docName.includes('Degree')) authorityStr = "Central Board of Secondary Education";
                }

                return (
                  <TouchableOpacity 
                    key={userDoc._id ? userDoc._id : Math.random().toString()}
                    activeOpacity={0.7}
                    onPress={() => handleDocumentPress(userDoc)}
                    className="bg-white py-4 flex-row items-center border-b border-gray-100"
                  >
                    <View className="w-12 h-12 justify-center items-center mr-4">
                      {logoUrl ? (
                        <Image source={{ uri: logoUrl }} className="w-10 h-10" resizeMode="contain" />
                      ) : null}
                    </View>
                    <View className="flex-1 justify-center">
                      <Text className="text-[17px] text-gray-800 mb-0.5">{docName}</Text>
                      <Text className="text-[13px] text-gray-500 leading-tight">{authorityStr}</Text>
                    </View>
                    <TouchableOpacity className="px-2 py-2">
                      <FontAwesome5 name="ellipsis-v" size={16} color="#9ca3af" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text className="text-gray-500 mt-6 italic text-center">No issued documents found.</Text>
            )}
          </ScrollView>
        </View>

      </View>
    </SafeAreaView>
  );
}
