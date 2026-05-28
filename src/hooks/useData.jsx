import { createContext, useContext, useState, useEffect } from "react";
import { defaultData } from "../data/portfolioData";
const DataContext = createContext(null);
export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem("portfolio_data"); return s ? { ...defaultData, ...JSON.parse(s) } : defaultData; } catch { return defaultData; }
  });
  useEffect(() => { localStorage.setItem("portfolio_data", JSON.stringify(data)); }, [data]);
  const update = (section, value) => setData(p => ({ ...p, [section]: value }));
  const resetToDefault = () => { localStorage.removeItem("portfolio_data"); setData(defaultData); };
  return <DataContext.Provider value={{ data, update, resetToDefault }}>{children}</DataContext.Provider>;
}
export const useData = () => useContext(DataContext);
