"use client";
import React from "react";
export default function ContactUS() {
  return (
    <div className="tw-flex tw-w-full tw-bg-black">
      <div className="tw-basis-1/2 ">
        <div className="tw-flex tw-flex-col tw-justify-center tw-gap-3 tw-p-10">
          <p className="tw-text-2xl tw-text-white">Comunícate con nosotros al correo <a
              className="tw-text-blue-300 tw-underline"
            href="mailto:fablabscz@unifranz.edu.bo">fablabscz@unifranz.edu.bo</a></p>
          <div className="tw-h-[1px] tw-w-[80%] tw-rounded-full tw-bg-gray-500" />
          <p className="tw-text-2xl tw-text-white">
            O, aún mejor, ¡ven a visitarnos!
          </p>
          <p className="tw-text-gray-400">
            Nos encanta recibir a todos, así que ven en cualquier momento
            durante las horas de oficina.
          </p>
          <p className="tw-text-2xl tw-text-white">FabLab Santa Cruz</p>
          <p className="tw-text-gray-400">
            Unifranz, Av Busch, 1113, Santa Cruz de la Sierra, Santa Cruz,
            Bolivia
          </p>
          <p className="tw-text-2xl tw-text-white">Horario</p>
          {/* lun 08:30 a.m. – 07:00 p.m. mar 08:30 a.m. – 07:00 p.m. mié 08:30 a.m. –
        07:00 p.m. jue 08:30 a.m. – 07:00 p.m. vie 08:30 a.m. – 07:00 p.m. sáb
        Cerrado dom Cerrado */}
          <ul className="tw-text-gray-400">
            <li>lun 08:30 a.m. – 07:00 p.m.</li>
            <li>mar 08:30 a.m. – 07:00 p.m.</li>
            <li>mié 08:30 a.m. – 07:00 p.m.</li>
            <li>jue 08:30 a.m. – 07:00 p.m.</li>
            <li>vie 08:30 a.m. – 07:00 p.m.</li>
            <li>sáb 08:30 a.m. – 07:00 p.m.</li>
            <li>Domingos cerrados.</li>
          </ul>
        </div>
      </div>
      <div className="tw-basis-1/2">
        
        <iframe
          className="tw-w-full tw-h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2451.521015529222!2d-63.192559586427144!3d-17.77524830600515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93f1e7fd21290381%3A0xf8715ec05923efc2!2sUNIFRANZ!5e0!3m2!1sen!2sbo!4v1718380128689!5m2!1sen!2sbo"
         
          height="450"
          // style="border:0;"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
