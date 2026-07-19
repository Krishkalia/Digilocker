import React, { useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function SecureViewerScreen({ route, navigation }) {
  const { document } = route.params || {};
  const { user } = useContext(AuthContext);

  const [isLoading, setIsLoading] = React.useState(true);

  // Determine file type from URL
  const fileUrl = document?.cloudStorageUrl || '';
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
  const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) != null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white z-50">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <FontAwesome5 name="arrow-left" size={20} color="#4a2bcf" />
        </TouchableOpacity>
        <Text className="text-[#4a2bcf] font-bold text-[16px] flex-1 text-center" numberOfLines={1}>
          {document?.documentName || 'in.ac.ptu-DGMST-23016362023l'}
        </Text>
        <View className="p-2 -mr-2 bg-gray-100 rounded-full h-8 w-8 items-center justify-center">
          <FontAwesome5 name="user" size={16} color="#6b7280" solid />
        </View>
      </View>

      {/* Document Content Area */}
      <View className="flex-1 justify-center items-center relative overflow-hidden bg-white">
        
        {/* Render Actual Content */}
        {fileUrl ? (
          isPdf ? (
            <View style={{ flex: 1, width: '100%' }}>
              {Platform.OS === 'web' ? (
                <iframe 
                  src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`}
                  style={{ flex: 1, width: '100%', border: 'none', height: '100vh' }}
                  onLoad={() => setIsLoading(false)}
                />
              ) : (
                <WebView 
                  source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}` }}
                  style={{ flex: 1, width: width }}
                  onLoadEnd={() => setIsLoading(false)}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View className="absolute inset-0 justify-center items-center bg-white">
                      <ActivityIndicator size="large" color="#4a2bcf" />
                    </View>
                  )}
                />
              )}
            </View>
          ) : isImage ? (
             <View style={{ flex: 1, width: '100%', backgroundColor: 'white' }}>
               {Platform.OS === 'web' ? (
                 <img 
                   src={fileUrl} 
                   style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                   onLoad={() => setIsLoading(false)} 
                 />
               ) : (
                 <WebView 
                   source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0"></head><body style="margin:0;padding:0;background-color:white;"><img src="${fileUrl}" style="width:100%; height:auto; display:block;" /></body></html>` }}
                   style={{ flex: 1, width: width, backgroundColor: 'white' }}
                   onLoadEnd={() => setIsLoading(false)}
                   javaScriptEnabled={true}
                   domStorageEnabled={true}
                   scalesPageToFit={true}
                   startInLoadingState={true}
                   renderLoading={() => (
                     <View className="absolute inset-0 justify-center items-center bg-white">
                       <ActivityIndicator size="large" color="#4a2bcf" />
                     </View>
                   )}
                 />
               )}
             </View>
          ) : (
             <View className="bg-gray-50 p-8 rounded-xl m-4 items-center border border-gray-200">
               <FontAwesome5 name="file-alt" size={60} color="#4a2bcf" className="mb-4" />
               <Text className="text-xl font-bold text-gray-800 text-center mb-2">Unsupported File</Text>
               <Text className="text-gray-500 text-center text-xs">This file type cannot be previewed natively.</Text>
             </View>
          )
        ) : (
          <View className="bg-gray-50 p-8 rounded-xl m-4 items-center border border-gray-200">
             <FontAwesome5 name="file-contract" size={60} color="#4a2bcf" className="mb-4" />
             <Text className="text-xl font-bold text-gray-800 text-center mb-2">{document?.documentName}</Text>
             <Text className="text-gray-500 text-center mb-2 font-mono text-xs">
               Type: {document?.documentType?.typeName || 'Unknown'}
             </Text>
             <Text className="text-gray-400 text-center text-xs">
               No valid file URL provided for this document.
             </Text>
          </View>
        )}

        {/* FAB Download Button */}
        <TouchableOpacity 
          className="absolute bottom-6 right-5 bg-[#4a2bcf] w-14 h-14 rounded-full justify-center items-center shadow-lg"
          style={{ elevation: 5, zIndex: 50 }}
        >
          <FontAwesome5 name="arrow-down" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Action Bar */}
      <View className="flex-row items-center justify-around bg-white border-t border-gray-200 pt-3 pb-5 z-50">
        <TouchableOpacity className="p-3">
          <FontAwesome5 name="home" size={24} color="#8c8c8c" solid />
        </TouchableOpacity>
        <TouchableOpacity className="p-3">
          <FontAwesome5 name="share-alt" size={24} color="#8c8c8c" />
        </TouchableOpacity>
        <TouchableOpacity className="p-3">
          <FontAwesome5 name="equals" size={24} color="#8c8c8c" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
