import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import {useEffect} from "react";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {PaperProvider} from "react-native-paper";
import {GlobalProvider} from "@/context/GlobalProvider";
import * as SystemUI from 'expo-system-ui';
import {useColorScheme} from "@/hooks/useColorScheme";

// import {useColorScheme} from "@/hooks/useColorScheme";
// import {useCallback, useEffect, useState} from "react";
// import {View} from "react-native";
import * as SplashScreen from "expo-splash-screen";

// SplashScreen.setOptions({
//     duration: 400,
//     fade: true
// })
//
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    // const [appIsReady, setAppIsReady] = useState(false);
    //
    // useEffect(() => {
    //     async function prepare() {
    //         try {
    //             await new Promise((resolve) => setTimeout(resolve, 1000));
    //         } catch (e) {
    //             console.warn(e);
    //         } finally {
    //             setAppIsReady(true);
    //         }
    //     }
    //     prepare();
    // }, []);
    //
    // const onLayoutRootView = useCallback(() => {
    //     if (appIsReady) {
    //         SplashScreen.hideAsync();
    //     }
    // }, [appIsReady]);
    //
    // if (!appIsReady) {
    //     return null;
    // }

    // SystemUI.setBackgroundColorAsync(colorScheme === "dark" ? DarkTheme.colors.background : DefaultTheme.colors.background);

    useEffect(() => {
        const setupApp = async () => {
            try {
                await SystemUI.setBackgroundColorAsync(
                    colorScheme === "dark"
                        ? DarkTheme.colors.background
                        : DefaultTheme.colors.background
                );
            } catch (error) {
                console.error('Error setting background color:', error);
            } finally {
                await SplashScreen.hideAsync();
            }
        };

        setupApp();
    }, [colorScheme]);

    return (
        <PaperProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <GlobalProvider>
                    {/*<View onLayout={onLayoutRootView}>*/}
                    <Stack>
                        <Stack.Screen
                            name="index"
                            options={{
                                headerShown: false,
                                title: "Home",
                                animation: "slide_from_left",
                            }}
                        />
                        <Stack.Screen
                            name="inventory"
                            options={{
                                headerShown: false,
                                animation: "slide_from_right",
                            }}
                        />
                        <Stack.Screen
                            name="product"
                            options={{headerShown: true, title: "Product"}}
                        />
                    </Stack>
                    {/*</View>*/}
                    <StatusBar style="auto"/>
                </GlobalProvider>
            </ThemeProvider>
        </PaperProvider>
    );
}
