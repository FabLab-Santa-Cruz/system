"use client";
import { type MenuProps } from "antd";
import {
  MdEngineering,
  MdOutlineProductionQuantityLimits,
  MdPeople,
  MdPerson2
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
  getItem("Perfil", "profile", <MdPerson2 />),
  getItem("Dashboard", "dashboard"),
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
  getItem("Perfil", "profile", <MdPerson2 />),
  getItem("Dashboard", "dashboard"),
  getItem("Inventario", "inventory", <MdOutlineProductionQuantityLimits />, [
    getItem("Marcas", "brands"),
    getItem("Categorias", "categories"),
    getItem("Lista", "inventory_list"),
  ]),
  ...COMMON_ITEMS
];
export const GUEST_ITEMS: MenuProps["items"] = [
  getItem("Perfil", "profile", <MdPerson2 />),
  getItem("Dashboard", "dashboard"),
  ...COMMON_ITEMS
];
