import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return <div>{session?.user?.name ?? "Guest"} </div>;
}
