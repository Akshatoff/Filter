import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#f75e4e" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'log-in-sharp' : 'log-in-outline'} color={color} size={24} />
          ),
        }}
      />
        <Tabs.Screen
        name="register"
        options={{
          title: 'Register',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'cloud-sharp' : 'cloud-outline'} color={color} size={24} />
          ),
        }}
      />
        

    </Tabs>
  );
}
