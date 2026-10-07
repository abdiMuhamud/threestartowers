import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const KEY = "saved-properties";

type Saved = { slugs: string[]; isSaved: (slug: string) => boolean; toggle: (slug: string) => void };

const SavedContext = createContext<Saved>({ slugs: [], isSaved: () => false, toggle: () => {} });

export function SavedProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setSlugs(JSON.parse(raw)))
      .catch(() => {});
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(() => ({ slugs, isSaved: (slug: string) => slugs.includes(slug), toggle }), [slugs, toggle]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export const useSaved = () => useContext(SavedContext);
