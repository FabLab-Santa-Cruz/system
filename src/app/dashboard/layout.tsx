"use client";
import { Menu, type MenuProps } from "antd";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../state/globalContext";
import Image from "next/image";
import { ADMIN_ITEMS, GUEST_ITEMS, VOLUNTEER_ITEMS } from "./MENU_ITEMS";
type MenuItem = Required<MenuProps>["items"][number];
export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = useGlobalContext();

  let items: MenuProps["items"] = GUEST_ITEMS;
  switch (global?.session?.user.userType) {
    case "ADMIN":
      items = ADMIN_ITEMS;
      break;
    case "VOLUNTEER":
      items = VOLUNTEER_ITEMS;
      break;
  }

  const router = useRouter();
  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      router.push("/api/auth/signout");
      return;
    }
    if (e.key.includes("__no_clickable__")) return;
    if (e.keyPath[0] === "dashboard") {
      router.push("/dashboard");
      return;
    }
    router.push(`/dashboard/${e.keyPath.reverse().join("/")}`);
  };
  const openKeys = ["inventory", "volunteers"];
  // This is just the sidebar
  return (
    <div
      className="tw-flex tw-min-h-screen tw-w-full tw-overflow-x-hidden"
      style={{ backgroundColor: global?.darkMode ? "#121212" : "#f0f0f0" }}
    >
      <div className=" tw-w-40">
        <Image
          alt="logo"
          src="/logo.png"
          width={160}
          height={0}
          style={{width: 160, height: "auto"}}

                  />
        <Menu
          onClick={onClick}
          className="tw-min-h-screen tw-w-40"
          items={items}
          mode="inline"
          defaultOpenKeys={openKeys}
        />
      </div>

      {/* <div className="tw-min-w-[calc(100%-40rem)] tw-max-w-[calc(100%-10rem)]">
        </div> */}
      {children}
    </div>
  );
}
