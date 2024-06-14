'use client'

import { useGlobalContext } from "../state/globalContext";


export default function AdmLand() {
  const global = useGlobalContext();

  return (
    <div className={global?.darkMode ?"tw-text-white" : "tw-text-black"}>
      <h1> Hola {global?.session?.user.name ?? ""}. Este es tu dashboard, a la izquierda tienes las distintas funciones de la app. Si requieres un permiso extra preguntale a tu administrador</h1>
    </div>
  );
}
