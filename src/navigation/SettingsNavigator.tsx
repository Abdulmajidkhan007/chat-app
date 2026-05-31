import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { SettingsStackParamList } from './types';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { NotificationSettingsScreen } from '@/screens/settings/NotificationSettingsScreen';
import { PrivacySettingsScreen } from '@/screens/settings/PrivacySettingsScreen';
import { ThemeSettingsScreen } from '@/screens/settings/ThemeSettingsScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { BlockedUsersScreen } from '@/screens/settings/BlockedUsersScreen';

const Stack = createStackNavigator<SettingsStackParamList>();

export function SettingsNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
    </Stack.Navigator>
  );
}
