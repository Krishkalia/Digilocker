import React, { useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import { AuthContext } from '../context/AuthContext';

import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function SecureViewerScreen({ route, navigation }) {
  const { document } = route.params || {};
  const { user } = useContext(AuthContext);

  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Block screenshots when this screen mounts (Mobile only)
    if (Platform.OS !== 'web') {
      ScreenCapture.preventScreenCaptureAsync().catch(console.warn);
    }

    return () => {
      // Allow screenshots again when this screen unmounts (Mobile only)
      if (Platform.OS !== 'web') {
        ScreenCapture.allowScreenCaptureAsync().catch(console.warn);
      }
    };
  }, []);

  // Determine file type from URL
  const fileUrl = document?.cloudStorageUrl || '';
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
  const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) != null;

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 z-50">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-lg">{document?.documentName || 'Secure Document'}</Text>
        <View className="w-8" />
      </View>

      {/* Document Content Area */}
      <View className="flex-1 justify-center items-center relative overflow-hidden bg-black">
        
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
                    <View className="absolute inset-0 justify-center items-center bg-black">
                      <ActivityIndicator size="large" color="#4a2bcf" />
                    </View>
                  )}
                />
              )}
            </View>
          ) : isImage ? (
             <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
               <Image 
                 source={{ uri: fileUrl }}
                 style={{ width: '100%', height: '100%' }}
                 resizeMode="contain"
                 onLoadEnd={() => setIsLoading(false)}
               />
               {isLoading ? (
                 <View className="absolute inset-0 justify-center items-center">
                   <ActivityIndicator size="large" color="#4a2bcf" />
                 </View>
               ) : null}
             </View>
          ) : (
             <View className="bg-white p-8 rounded-xl shadow-lg m-4 items-center">
               <FontAwesome5 name="file-alt" size={60} color="#4a2bcf" className="mb-4" />
               <Text className="text-xl font-bold text-gray-800 text-center mb-2">Unsupported File</Text>
               <Text className="text-gray-500 text-center text-xs">This file type cannot be previewed natively.</Text>
             </View>
          )
        ) : (
          <View className="bg-white p-8 rounded-xl shadow-lg m-4 items-center">
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

        {/* Dynamic Watermark Overlay */}
        <View style={StyleSheet.absoluteFill} className="pointer-events-none justify-center items-center opacity-20 z-40">
            {/* Generating multiple diagonal watermarks */}
            {Array.from({ length: 25 }).map((_, i) => (
               <Text 
                 key={i} 
                 style={{
                   transform: [{ rotate: '-45deg' }],
                   position: 'absolute',
                   top: (Math.random() * height * 1.5) - height * 0.2,
                   left: (Math.random() * width * 1.5) - width * 0.2,
                   fontSize: 14,
                   color: 'white',
                   fontWeight: 'bold',
                   width: 300,
                   textAlign: 'center'
                 }}
               >
                 {user?.email}{'\n'}{new Date().toISOString().split('T')[0]}
               </Text>
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
