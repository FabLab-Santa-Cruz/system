'use client'

import { Switch } from "antd";
import { useGlobalContext } from "../state/globalContext";

export default function ThemeSwitch() {
  const global = useGlobalContext();
  return <Switch
    className=""
    checkedChildren={"Dark"}
    unCheckedChildren={"Light"}
    checked={global?.darkMode}
    onChange={(checked) => global?.setDarkMode(checked)}
  />;
}