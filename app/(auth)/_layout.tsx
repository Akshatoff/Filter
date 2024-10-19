import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* The bottom tab would normally go here, but we won't show it in this case */}
    </Tabs>
  );
}
