import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { company } from "@/content/properties";

// The website hosts the endpoints the app reports to (see web/src/app/api).
const API = `https://${company.website}/api`;
const INSTALL_KEY = "install-id";

async function post(path: string, body: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch {
    return false; // Offline or server down: never let reporting break the app.
  }
}

/** A random id created on first launch. It identifies this installation, not the person. */
export async function getInstallId(): Promise<string> {
  let id = await AsyncStorage.getItem(INSTALL_KEY).catch(() => null);
  if (!id) {
    id = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    await AsyncStorage.setItem(INSTALL_KEY, id).catch(() => {});
  }
  return id;
}

/** Called on every launch: the first call registers the install, later ones mark it active. */
export async function reportLaunch() {
  await post("/installs", {
    installId: await getInstallId(),
    platform: Platform.OS,
    appVersion: Constants.expoConfig?.version ?? null,
  });
}

export async function submitLead(lead: { name: string; phone: string; propertySlug?: string; interest?: string }) {
  return post("/leads", { ...lead, source: "app", installId: await getInstallId() });
}

export async function reportPropertyView(propertySlug: string) {
  await post("/events", { type: "property_view", propertySlug, installId: await getInstallId() });
}
