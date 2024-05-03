"use client";
import React from "react";

//Global context
import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
type GlobalContextType = {
	messageApi: MessageInstance;
};
export const GlobalContext = React.createContext<GlobalContextType | undefined>(
	undefined,
);
export const useGlobalContext = () => React.useContext(GlobalContext);
export const GlobalProvider = (props: { children: React.ReactNode }) => {
	const [messageApi, contextHolder] = message.useMessage();
	return (
		<GlobalContext.Provider value={{ messageApi }}>
			{contextHolder}
			{props.children}
		</GlobalContext.Provider>
	);
};