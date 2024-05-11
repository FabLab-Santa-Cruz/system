"use client";
import React, { useCallback, useEffect, useState } from "react";
import esEs from "antd/es/locale/es_ES";
//Global context
import { ConfigProvider, message, theme } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { type Session } from "next-auth";
type GlobalContextType = {
  messageApi: MessageInstance;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  session: Session | null
};
export const GlobalContext = React.createContext<GlobalContextType | undefined>(
  undefined,
);
export const useGlobalContext = () => React.useContext(GlobalContext);
export const GlobalProvider = (props: { children: React.ReactNode, session: Session | null }) => {
  const [messageApi, contextHolder] = message.useMessage();

  /**
   * -------Theme
   */
  
  const [darkMode, setDarkMode] = useState(false);
  
  const darkModeChange = useCallback((event: MediaQueryListEvent) => {
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      return;
    }
    if (localStorage.getItem("theme") === "light") {
      setDarkMode(false);
      return;
    }
    setDarkMode(event.matches ? true : false);
  }, []);
  let windowQuery: MediaQueryList | undefined;
  if (typeof window !== "undefined") {
    windowQuery = window.matchMedia("(prefers-color-scheme:dark)");
  }
  //const windowQuery = window_checked?.matchMedia("(prefers-color-scheme:dark)");
  useEffect(() => {
    windowQuery?.addEventListener("change", darkModeChange);
    return () => {
      windowQuery?.removeEventListener("change", darkModeChange);
    };
  }, [windowQuery, darkModeChange]);
  useEffect(() => {
    setDarkMode(windowQuery?.matches ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  /**
   * -------
   */

  return (
      
    <GlobalContext.Provider value={{ messageApi, darkMode, setDarkMode, session: props.session }}>
        {contextHolder}
        <ConfigProvider
          theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: "#642488",
            },
          }}
          locale={esEs}
        >
          {props.children}
        </ConfigProvider>
    </GlobalContext.Provider>
      
  );
};
