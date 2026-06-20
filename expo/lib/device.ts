import * as SecureStore from "expo-secure-store";

const DEVICE_ID_KEY = "sherehe.device_id.v1";

let cachedId: string | null = null;

/**
 * Generate a UUID v4 (random) string without any native dependencies.
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get the persistent anonymous device identifier.
 *
 * Created on first launch and stored in the iOS Keychain / Android
 * EncryptedSharedPreferences via expo-secure-store. This survives
 * app reinstalls on iOS (Keychain is tied to the provisioning profile)
 * and is used as the RevenueCat App User ID for anonymous users.
 */
export async function getDeviceId(): Promise<string> {
  if (cachedId) return cachedId;

  try {
    const stored = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (stored && stored.length > 0) {
      cachedId = stored;
      return stored;
    }
  } catch {
    console.log("[device] secure read failed, generating new id");
  }

  const id = generateUUID();
  cachedId = id;
  try {
    await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
    console.log("[device] persisted new device id", id.slice(0, 8) + "...");
  } catch {
    console.log("[device] failed to persist device id");
  }
  return id;
}

/**
 * Replace the device ID with a new one (used when merging anonymous data
 * into a real account — the old ID is archived and the account UUID takes over).
 */
export async function setDeviceId(id: string): Promise<void> {
  cachedId = id;
  try {
    await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
  } catch {
    console.log("[device] failed to persist updated device id");
  }
}
