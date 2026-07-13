import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function SearchScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://192.168.1.5:5000/api';

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDocs(documents);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = documents.filter(userDoc => {
        const docName = userDoc?.document?.documentName ? userDoc.document.documentName.toLowerCase() : 'aadhaar card';
        let authorityStr = "government of india";
        if (docName.includes('apaar')) authorityStr = "academic bank of credits";
        else if (docName.includes('aadhaar')) authorityStr = "unique identification authority of india (uidai)";
        else if (docName.includes('marksheet') || docName.includes('degree')) authorityStr = "central board of secondary education";
        
        return docName.includes(lowercasedQuery) || authorityStr.includes(lowercasedQuery);
      });
      setFilteredDocs(filtered);
    }
  }, [searchQuery, documents]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      setDocuments(response.data);
      setFilteredDocs(response.data);
    } catch (error) {
      console.error('Error fetching documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentPress = (doc) => {
    navigation.navigate('SecureViewer', { document: doc.document });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      
      {/* Header & Search Bar */}
      <View className="bg-[#3838D9] pt-12 pb-6 px-5 relative z-10 rounded-b-[30px]">
        <Text className="text-white text-[24px] font-bold mb-6">Search Documents</Text>
        
        <View className="bg-white flex-row items-center rounded-full px-5 py-3 shadow-sm border border-gray-100">
          <FontAwesome5 name="search" size={18} color="#6b7280" className="mr-3" />
          <TextInput 
            className="flex-1 text-[15px] text-gray-800"
            placeholder="Search by document name or authority..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1 ml-2">
              <FontAwesome5 name="times-circle" size={16} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results List */}
      <View className="flex-1 px-5 pt-6 bg-white">
        <Text className="text-gray-600 text-[14px] font-medium mb-4">
          {searchQuery ? `Search Results (${filteredDocs.length})` : `All Issued Documents (${documents.length})`}
        </Text>
        
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#3838D9" className="mt-10" />
          ) : filteredDocs && filteredDocs.length > 0 ? (
            filteredDocs.map((userDoc) => {
              const docName = userDoc?.document?.documentName ? userDoc.document.documentName : 'Aadhaar Card';
              
              let logoUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxbJv-DsOFG-BRJgzdkiV00fbNdVCG5YlMBVm6CVGyW0yz_2kOMwsfGRQkh5p4nBR6rEhhFX6YbuS8j_UGiPIj-z8mzmJa_fqPRxSRSoWnXPz_6SzgP0H-krGimYECyCC8UFfMAS0C8YTqSGWvR8uPIhznvhdY5F0ebC8loOC4btgjg0CrgipaZeg1CQ5y2TssJjRKh_ksUBJkIuU2q5WCU2-wbgVh1ypCQWk4UqhafSsx6Gvo30dfLHRc2qRPcKfR3c0X0H1zYDHn'; 
              let authorityStr = "Government of India";

              if (docName.includes('APAAR')) {
                authorityStr = "Academic Bank of Credits";
                logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDKJXZU0PqF8zM3B3oVqj1Q_gM4C6w2zK_7s1vT9jRzD5qX_x8Z7W_QY_t_m_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N_N"; 
              } else if (docName.includes('Aadhaar')) {
                authorityStr = "Unique Identification Authority of India (UIDAI)";
              } else if (docName.includes('Marksheet') || docName.includes('Degree')) {
                authorityStr = "Central Board of Secondary Education";
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
                  <FontAwesome5 name="chevron-right" size={14} color="#d1d5db" />
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="mt-10 items-center">
              <FontAwesome5 name="search" size={40} color="#e5e7eb" className="mb-4" />
              <Text className="text-gray-400 text-center text-base">No documents found matching "{searchQuery}"</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
