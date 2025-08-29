import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {PaperProvider} from "react-native-paper";
import {GlobalProvider} from "@/context/GlobalProvider";
import {useColorScheme} from "@/hooks/useColorScheme";
import {useCallback, useEffect, useState} from "react";
import {View} from "react-native";
import * as SplashScreen from "expo-splash-screen";

// SplashScreen.setOptions({
//     duration: 400,
//     fade: true
// })
//
// SplashScreen.preventAutoHideAsync();

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

    return (
        <PaperProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <GlobalProvider>
                    {/*<View onLayout={onLayoutRootView}>*/}
                        <Stack>
                            <Stack.Screen
                                name="index"
                                options={{
                                    headerShown: true,
                                    title: "Home",
                                }}
                            />
                            <Stack.Screen
                                name="inventory"
                                options={{headerShown: true, title: "Inventory"}}
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
