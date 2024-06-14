import TopBar from "~/app/_components/Intro/TopBar";
import WhatsAFab from "~/app/_components/Intro/WhatsAFab";
import ContactUS from "~/app/_components/Intro/ContactUS";
export default async function Home() {
  return (
    <>
      <TopBar />
      <div className="tw-bg-portada-fablab tw-flex tw-h-screen tw-w-full tw-items-center tw-justify-center tw-bg-cover tw-bg-no-repeat">
        <div className="tw-text-center tw-text-[40px] tw-font-bold tw-text-white ">
          Bienvenido a FabLab Santa Cruz
        </div>
      </div>
      <WhatsAFab />
      <ContactUS />
    </>
  );
}
