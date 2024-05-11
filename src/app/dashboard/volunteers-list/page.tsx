import { Tabs } from "antd";
import ChartsVolunteers from "~/app/_components/ChartsVolunteers";
import VolunteerList from "~/app/_components/VolunteerList";

export default function PageVolunteerList() {
  const items = [
    {
      key: "1",
      label: "Voluntarios",
      children: <VolunteerList />,
    },
    {
      key: "2",
      label: "Estadisticas",
      children: <ChartsVolunteers />,
    }
  ]
  return (
    <div className="tw-h-screen tw-p-4 tw-w-full">
      <Tabs
        
        defaultActiveKey="1"
        items={items}
      />
    </div>
  );
}
