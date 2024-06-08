import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <div className="tw-flex tw-h-screen tw-w-full tw-items-center tw-justify-center">
      <div className="tw-text-center">
        En construccion, Holaaaaaaaa
        <div className="tw-text-center tw-flex tw-flex-col">
          {session?.user?.name && <p>Bienvenido {session.user.name}</p>}
          {session?.user?.name ? (
            <a
              className="tw-underline"
              href="/dashboard"
            >{`Ir al dashboard `}</a>
          ) : (
            <a href="/api/auth/signin">Iniciar Sesion</a>
          )}
          {session?.user?.name && (
            <a className="tw-underline" href="/api/auth/signout">
              Cerrar sesion
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
