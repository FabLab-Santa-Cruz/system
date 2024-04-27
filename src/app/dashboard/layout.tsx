"use client";
import { Menu, type MenuProps } from "antd";
import { MdOutlineProductionQuantityLimits, MdPerson } from "react-icons/md";
import { useRouter } from "next/navigation";
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
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
  
  const items: MenuProps["items"] = [
			getItem("Dashboard", "dashboard"),
			getItem(
				"Inventario",
				"inventory",
				<MdOutlineProductionQuantityLimits />,
				[
					getItem("Marcas", "brands"),
					getItem("Categorias", "categories"),
					getItem("Lista de productos", "list"),
				],
			),
			getItem("Voluntarios", "volunteers", <MdPerson />, [
				getItem("Lista", "list"),
			]),
			// Logout
			getItem("Logout", "logout"),
		];
  const router = useRouter();
  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      router.push("/api/auth/signout");
      return;
    }
    console.log(123);
    if (e.keyPath[0] === "dashboard") {
      router.push("/dashboard");
      return;
    }
    router.push(`/dashboard/${e.keyPath.reverse().join("/")}`);
  };
  const openKeys = ["inventory", "volunteers"];
  // This is just the sidebar
  return (
    <div className="tw-flex">
      <div className="tw-h-screen  tw-bg-gray-100">
        <Menu
          onClick={onClick}
          className="tw-w-40"
          items={items}
          mode="inline"
          defaultOpenKeys={openKeys}
        />
      </div>
      {children}
    </div>
  );
}
