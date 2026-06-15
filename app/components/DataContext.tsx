"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteData } from "@/app/data/siteDataManager";
import { defaultSiteData } from "@/app/data/defaultSiteData";

interface DataContextType {
  data: SiteData;
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  data: defaultSiteData,
  loading: false,
});

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch("/api/data");
        if (res.ok) {
          const liveData = await res.json();
          if (liveData && !liveData.error) {
            setData(liveData);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live site data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLive();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading }}>
      {children}
    </DataContext.Provider>
  );
}
