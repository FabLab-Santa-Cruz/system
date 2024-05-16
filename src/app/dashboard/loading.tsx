
import Image from "next/image";

export default function LoadingDashboard() {
  return (
    <div className="tw-flex tw-h-screen tw-w-full tw-items-center tw-justify-center">
      
      <Image
        className="tw-animate-spin"
        width={200}
        height={200}
        alt="logo"
          src="/pictures/iconlogo.png" />;
        
    </div>
  );
}
