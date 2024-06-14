"use client";
import TopBar from "~/app/_components/Intro/TopBar";
import React from "react";
import { Image } from "antd";
export default function Espacios() {
  return (
    <>
      <TopBar />
      <div className="tw-flex tw-h-full tw-bg-black tw-pt-40 tw-text-white tw-pb-10">
        <div className="tw-mx-auto tw-w-[70%] ">
          <div>
            <p className="tw-text-2xl">Espacios</p>
          </div>
          <div className="tw-h-[1px] tw-w-full tw-rounded-full tw-bg-gray-500" />

          <div className="tw-mt-4 tw-flex tw-flex-col tw-gap-4">
            <Mostrador
              imageSrc="/pictures/espacios/3d.webp"
              title="Impresion 3D"
              description="La impresión 3D es un avance muy importante de tecnologías
              de fabricación por adición donde un objeto tridimensional es
              creado mediante la superposición de capas sucesivas de
              material.​​"
              // reverse={true}
            />
            <Mostrador
              imageSrc="/pictures/espacios/laser.webp"
              title="Corte Laser"
              description=" Un laser de CO2 es un equipo para corte y grabado asistido controlado por un ordenador a través de un archivo vectorizado. "
              reverse={true}
            />
            <Mostrador
              imageSrc="/pictures/espacios/enrutadora.webp"
              title="Enrutadora"
              description="Una máquina controlada por una computadora y su función es realizar cortes de forma automatizada. Las trayectorias de los cortes son controladas mediante un sistema denominado de control numérico, mismo que envía desde el ordenador las coordenadas del corte con una precisión milimétrica. "
              reverse={false}
            />
            <Mostrador
              imageSrc="/pictures/espacios/vr.webp"
              title="Realidad Virtual"
              description="La realidad virtual es la creación de un entorno o escenario ficticio o simulado con apariencia totalmente real y que nos permite trasladarnos a cualquier lugar o situación que queramos como si nos creyésemos dentro de él, con la ilusión de estar dentro de este entorno."
              reverse={true}
            />
            <Mostrador
              imageSrc="/pictures/espacios/robotica.webp"
              title="Programacion y Robotica"
              description="La programación informática es la disciplina orientada al desarrollo de aplicaciones, herramientas virtuales o software  de cualquier proceso digital. 
                          La robótica está relacionada con la ingeniería, la construcción y la operación de robots. Es un sector con amplios y diversos usos de consumo. "
              reverse={false}
            />
            <Mostrador
              imageSrc="/pictures/espacios/biomateriales.webp"
              title="Biomateriales"
              description=" Materiales biológicos: son todos aquellos generados por la propia naturaleza como puede ser la madera o los huesos humanos. La principal diferencia respecto a los biomateriales es que estos son sintetizados por el ser humano."
              reverse={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function Mostrador({
  imageSrc,
  title,
  description,
  reverse,
}: {
  imageSrc: string;
  title: string;
  description: string;
  reverse?: boolean;
}) {
  if (reverse)
    return (
      <div className="tw-flex ">
        <div className="tw-flex tw-basis-1/2 tw-items-center tw-justify-center">
          <div className="tw-mx-10">
            <p>{title}</p>
            <p className="tw-text-left tw-text-gray-400">{description}</p>
          </div>
        </div>
        <div className="tw-basis-1/2">
          <Image alt="imagen de mostrador" src={imageSrc} />
        </div>
      </div>
    );

  return (
    <div className="tw-flex ">
      <div className="tw-basis-1/2">
        <Image alt="imagen de mostrador" src={imageSrc} />
      </div>
      <div className="tw-flex tw-basis-1/2 tw-items-center tw-justify-center">
        <div className="tw-mx-10">
          <p>{title}</p>
          <p className="tw-text-left tw-text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
