"use client";
import { type MenuProps } from "antd";
import {
  MdEngineering,
  MdOutlineProductionQuantityLimits,
  MdPanTool,
  MdPeople,
  MdPerson2,
  MdProductionQuantityLimits,
  MdScale
} from "react-icons/md";
import ThemeSwitch from "../_components/ThemeSwitch";
import { getItem } from "./layout";

/**
 * It's not in actual requirements to make a custom menu for every user so we use "access levels" which are users types.
 */
const COMMON_ITEMS: MenuProps["items"] = [
  getItem("", `${Math.random()}__no_clickable__`, <ThemeSwitch />),
  getItem("Cerrar sesion", "logout"),
];
export const ADMIN_ITEMS: MenuProps["items"] = [
  getItem("Dashboard", "dashboard"),
  getItem("Perfil", "profile", <MdPerson2 />),
  getItem("Proyectos", "projects", <MdPanTool />),
  getItem("Inventario", "inventory", <MdOutlineProductionQuantityLimits />, [
    getItem("Marcas", "brands"),
    getItem("Categorias", "categories"),
    getItem("Lista", "inventory_list"),
  ]),
  getItem("Voluntarios", "volunteers-list", <MdEngineering />),
  getItem("Personas", "persons-list", <MdPeople />),
  ...COMMON_ITEMS,
];
export const VOLUNTEER_ITEMS: MenuProps["items"] = [
  getItem("Dashboard", "dashboard"),
  getItem("Perfil", "profile", <MdPerson2 />),
  getItem("Proyectos", "projects", <MdPanTool />),
  getItem("Inventario", "inventory", <MdOutlineProductionQuantityLimits />, [
    getItem("Marcas", "brands"),
    getItem("Categorias", "categories"),
    getItem("Lista", "inventory_list"),
  ]),
  getItem("Dashboard", "dashboard"),
  ...COMMON_ITEMS
];
export const GUEST_ITEMS: MenuProps["items"] = [
  getItem("Dashboard", "dashboard"),
  getItem("Perfil", "profile", <MdPerson2 />),
  ...COMMON_ITEMS
];
