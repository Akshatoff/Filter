import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#f75e4e" }}>
        <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
        <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time-sharp' : 'time-outline'} color={color} size={24} />
          ),
        }}
      />
        <Tabs.Screen
        name="verification"
        options={{
          title: 'Text Verification',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'text-sharp' : 'text-outline'} color={color} size={24} />
          ),
        }}
      />
        <Tabs.Screen
        name="imageverification"
        options={{
          title: 'Image Verification',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'image-sharp' : 'image-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
