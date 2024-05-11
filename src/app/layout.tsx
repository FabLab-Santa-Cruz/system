import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { GlobalProvider } from "./state/globalContext";

export const metadata = {
  title: "FabLab App",
  description: "Tools",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
import { authOptions } from "~/server/auth";
import { getServerSession } from "next-auth/next";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="es">
      <body>
        <AntdRegistry>
          <TRPCReactProvider>
            <GlobalProvider session={session}>{children}</GlobalProvider>
          </TRPCReactProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
