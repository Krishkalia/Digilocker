import React, { useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import { AuthContext } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SecureViewerScreen({ route, navigation }) {
  const { document } = route.params || {};
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Block screenshots when this screen mounts
    ScreenCapture.preventScreenCaptureAsync();

    return () => {
      // Allow screenshots again when this screen unmounts
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 z-50">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-lg">{document?.documentName || 'Secure Document'}</Text>
        <View className="w-8" /> {/* Placeholder for balance */}
      </View>

      {/* Document Content Area */}
      <View className="flex-1 justify-center items-center relative overflow-hidden">
        
        {/* Placeholder for actual PDF/Image Viewer */}
        <View className="bg-white p-8 rounded-xl shadow-lg m-4 items-center">
           <FontAwesome5 name="file-contract" size={60} color="#4a2bcf" className="mb-4" />
           <Text className="text-xl font-bold text-gray-800 text-center mb-2">{document?.documentName}</Text>
           <Text className="text-gray-500 text-center mb-2 font-mono text-xs">
             Type: {document?.documentType?.typeName || 'Unknown'}
           </Text>
           <Text className="text-gray-400 text-center text-xs">
             This is a secure preview. Native rendering (e.g., react-native-pdf) would occur here.
           </Text>
        </View>

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
