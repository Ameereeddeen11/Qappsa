import {useCameraPermissions} from "expo-camera";

export function useCameraPermission() {
    const [permission, requestPermission] = useCameraPermissions();

    return {
        permission,
        requestPermission
    };
}