import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import type { SettingsStackParamList } from '@/navigation/types';
import { useTheme } from '@/hooks/useTheme';

type Props = StackScreenProps<SettingsStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props): React.JSX.Element {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.center}>
        <Text style={{ color: theme.colors.text, fontSize: theme.fontSizes.lg }}>
          Edit Profile
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
