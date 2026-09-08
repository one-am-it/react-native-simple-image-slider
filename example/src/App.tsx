import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PhotoScreen } from './gallery/photo-screen';
import { HomeScreen } from './home-screen';
import type { RootStackParamList } from './navigation-types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * The viewer is presented the way a consumer presents it — a transparent modal that fades up over
 * the screen behind, rather than sliding in from the side.
 */
export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen
                        name="Photo"
                        component={PhotoScreen}
                        options={{
                            presentation: 'transparentModal',
                            animation: 'fade',
                            contentStyle: { backgroundColor: 'transparent' },
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
