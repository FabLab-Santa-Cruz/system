import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import { TRPCReactProvider } from "~/trpc/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import esEs from "antd/es/locale/es_ES";
import { GlobalProvider } from "./globalContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "FabLab App",
  description: "Tools",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
			<html lang="en">
				<body className={`font-sans ${inter.variable}`}>
					<GlobalProvider>
						<TRPCReactProvider>
							<AntdRegistry>
								<ConfigProvider locale={esEs}>{children}</ConfigProvider>?
							</AntdRegistry>
						</TRPCReactProvider>
					</GlobalProvider>
				</body>
			</html>
		);
}
