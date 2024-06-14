export default function WhatsAFab() {
  return (
    <div className="tw-flex  tw-w-full tw-flex-col tw-items-center tw-justify-center tw-bg-gray-950 tw-pt-6">
      <div className="tw-text-white">
        <h1 className="tw-text-3xl tw-font-bold ">¿Que es una Fablab?</h1>
      </div>
      {/* Draw a line to separate */}
      <div className="tw-h-[1px] tw-w-[80%] tw-rounded-full tw-bg-gray-500"></div>
      <div className="tw-mx-10 tw-w-[80%] tw-break-words tw-pb-4 tw-text-left tw-text-gray-200">
        <blockquote className="tw-text-center tw-text-2xl">
          {`"Un Fab Lab, o laboratorio de fabricación digital, es un lugar para
          jugar, crear, asesora e inventar: un lugar para el aprendizaje y la
          innovación. Los Fab Labs brindan acceso al medio ambiente, las
          habilidades, los materiales y la tecnología avanzada para permitir que
          cualquier persona en cualquier lugar pueda fabricar (casi) cualquier
          cosa."`}
        </blockquote>
        <cite>- Neil Gershenfeld</cite>
        <p className="tw-pt-2 tw-text-center tw-text-xl tw-text-gray-400">
          {" "}
          Somos el 1er FabLab de Bolivia registrado en Fab Foundation
          <a
            className="tw-text-blue-300 tw-underline"
            href="https://fablabs.io/labs/fablabscz"
          >
            (https://fablabs.io/labs/fablabscz)
          </a>
          con acceso libre al público en general.
        </p>
        <p className="tw-text-center tw-text-xl tw-text-gray-400">
          Es el único FabLab donde cualquier persona sin importar su edad, su
          carrera, su género puede acceder y desarrollar sus habilidades.
        </p>
        <p className="tw-pt-4 tw-text-center tw-text-2xl tw-text-white">
          Atrévete a cambiar el mundo y ven a visitarnos
        </p>
      </div>
    </div>
  );
}
