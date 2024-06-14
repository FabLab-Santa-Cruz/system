"use client";
import { Button, Image } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGlobalContext } from "~/app/state/globalContext";



export default function TopBar() {
  const global = useGlobalContext();
  const isActive = () => {
    const path = window?.location.pathname;
    if (path == "/") return "inicio";
    if (path == "/espacios") return "espacios";
    if (path == "/galeria") return "galeria";
    if (path == "/actividades") return "actividades";
    if (path == "/proyectos") return "proyectos";
    if (path == "/login") return "login";

    return "";
  };

  

  const links = ['Inicio', 'Espacios', 'Galeria', 'Actividades', 'Proyectos'];
  const generateLinks = () => {
    const active = isActive();
    console.log(active)
    const linksGen = links.map((link) => {
      const exceptionHref = () => {
        if(link.toLowerCase() == 'inicio'){
          return '/'
        }
        return `/${link.toLowerCase()}`
      }
      return (
        <Link
          
          key={link}
          className={`tw-underline-offset-8 ${active == link.toLowerCase() ? "tw-underline " : ""}`}
          href={exceptionHref()}
        >
          {link}
        </Link>
      );
    });
    if(global?.session){
      
      linksGen.push(
        <Link
          key="dashboard"
          className={`tw-underline-offset-8 ${active == "login" ? "tw-underline " : ""}`}
          href="/dashboard"
        >
          Dashboard
        </Link>
      );
      linksGen.push(
        <Link
          key="logout"
          className={`tw-underline-offset-8 ${active == "login" ? "tw-underline " : ""}`}
          href="/api/auth/signout"
        >
          Cerrar sesion
        </Link>
      );

    } else {
      linksGen.push(
        <Link
          key="login"
          className={`tw-underline-offset-8 ${active == "login" ? "tw-underline " : ""}`}
          href="/api/auth/signin"
        >
          Login
        </Link>
      );
    }


    return linksGen
  };
  const [linksStatus, setLinksStatus] = useState(generateLinks());
  
  useEffect(() => {
    setLinksStatus(generateLinks());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [global?.session]);

  return (
    <div className="tw-flex tw-h-20 tw-bg-black tw-bg-opacity-40 tw-fixed tw-w-full">
      <div className="tw-flex tw-basis-1/2 tw-items-center tw-justify-center">
        <Image alt="logo" src="/pictures/logo.png" height={80} />
      </div>
      <div className="tw-flex tw-basis-1/2 tw-items-center tw-justify-center tw-gap-4 tw-text-white ">
        {linksStatus}
      </div>
    </div>
  );
}
