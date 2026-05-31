import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { ChatStackParamList } from './types';
import { ChatListScreen } from '@/screens/main/ChatListScreen';
import { ChatDetailScreen } from '@/screens/chat/ChatDetailScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { GroupInfoScreen } from '@/screens/groups/GroupInfoScreen';
import { ChannelInfoScreen } from '@/screens/groups/ChannelInfoScreen';
import { ForwardMessageScreen } from '@/screens/chat/ForwardMessageScreen';
import { TopicDetailScreen } from '@/screens/groups/TopicDetailScreen';
import { MediaPreviewScreen } from '@/screens/chat/MediaPreviewScreen';

const Stack = createStackNavigator<ChatStackParamList>();

export function ChatNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="MediaPreview" component={MediaPreviewScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      <Stack.Screen name="ChannelInfo" component={ChannelInfoScreen} />
      <Stack.Screen name="ForwardMessage" component={ForwardMessageScreen} />
      <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />
    </Stack.Navigator>
  );
}
