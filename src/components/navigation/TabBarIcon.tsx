import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export type TabBarIconName = 'chats' | 'contacts' | 'search' | 'settings';

interface TabBarIconProps {
  name: TabBarIconName;
  color: string;
  size: number;
}

const iconMap: Record<TabBarIconName, keyof typeof Ionicons.glyphMap> = {
  chats: 'chatbubble-ellipses',
  contacts: 'people',
  search: 'search',
  settings: 'settings-sharp',
};

export function TabBarIcon({ name, color, size }: TabBarIconProps): React.JSX.Element {
  return <Ionicons name={iconMap[name]} size={size} color={color} />;
}
