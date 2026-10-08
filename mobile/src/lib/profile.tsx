import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { submitLead } from "./api";

const KEY = "profile";

export type Profile = { name: string; phone: string; synced: boolean };

type ProfileState = {
  /** undefined while loading from storage, null when the visitor has not registered yet. */
  profile: Profile | null | undefined;
  register: (name: string, phone: string) => Promise<void>;
};

const ProfileContext = createContext<ProfileState>({ profile: undefined, register: async () => {} });

const save = (profile: Profile) => AsyncStorage.setItem(KEY, JSON.stringify(profile)).catch(() => {});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY).catch(() => null);
      const stored: Profile | null = raw ? JSON.parse(raw) : null;
      setProfile(stored);
      // Registered while offline: send the details now.
      if (stored && !stored.synced && (await submitLead(stored))) {
        const synced = { ...stored, synced: true };
        setProfile(synced);
        save(synced);
      }
    })();
  }, []);

  const register = useCallback(async (name: string, phone: string) => {
    const synced = await submitLead({ name, phone });
    const next = { name, phone, synced };
    setProfile(next);
    save(next);
  }, []);

  const value = useMemo(() => ({ profile, register }), [profile, register]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export const useProfile = () => useContext(ProfileContext);
