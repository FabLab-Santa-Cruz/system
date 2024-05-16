import {
  Descriptions,
  type DescriptionsProps,
  Table,
  Typography,
  Tooltip,
} from "antd";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";

export default function VolunteerAssistence({ id }: { id: string }) {
  const assistence = api.volunteer.assistenceVolunteer.useQuery({
    id,
  });
  const columns: ColumnProps<
    RouterOutputs["volunteer"]["assistenceVolunteer"]["assistences"][0]
  >[] = [
    {
      title: "Fecha",
      key: "date",
      width: 100,
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (_, row) => dayjs(row.date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Temperatura",
      key: "temperature",
      width: 50,
      render: (_, row) => `${row.weather_log?.temperature_c ?? "-"} C
        `,
    },
    {
      title: "Humedad",
      key: "humidity",
      width: 50,
      render: (_, row) => `${row.weather_log?.humidity ?? "-"} 
        `,
    },
    {
      title: "Dir. Viento",
      key: "windir",
      render: (_, row) => `${row.weather_log?.wind_dir ?? "-"} 
        `,
    },
    {
      title: "Vel. Viento ",
      key: "winspeed",
      width: 50,
      render: (_, row) => `${row.weather_log?.wind_speed_kmh ?? "-"} 
        `,
    },
    {
      title: "Presion ATM",
      key: "pressure",
      width: 50,
      render: (_, row) => `${row.weather_log?.pressure ?? "-"} 
        `,
    },
    {
      title: <Tooltip title="Precipitación">Prec.</Tooltip>,
      key: "precipitation",
      width: 50,
      render: (_, row) => `${row.weather_log?.precipitation_mm ?? "-"} 
        `,
    },
    {
      title: "Nubes",
      width: 50,
      key: "clouds",
      render: (_, row) => `${row.weather_log?.cloud ?? "-"} 
        `,
    },
    {
      title: <Tooltip title="Monoxido de carbono">CO</Tooltip>,
      key: "carbonmonoxide",
      render: (
        _,
        row,
      ) => `${row.weather_log?.air_quality_weather?.carbon_monoxide ?? "-"} 
        `,
    },
    {
      title: <Tooltip title="Dioxido de nitrogeno">NO2</Tooltip>,
      key: "nitrogen_dioxide",
      render: (
        _,
        row,
      ) => `${row.weather_log?.air_quality_weather?.nitrogen_dioxide ?? "-"} 
        `,
    },
    {
      title: <Tooltip title="Dioxido de azufre">SO2</Tooltip>,
      key: "sulfur_dioxide",
      render: (
        _,
        row,
      ) => `${row.weather_log?.air_quality_weather?.sulfur_dioxide ?? "-"} 
        `,
    },
    {
      title: (
        <Tooltip title="Particulas menores a 2.5 micrometros">P25</Tooltip>
      ),
      key: "p25",
      render: (
        _,
        row,
      ) => `${row.weather_log?.air_quality_weather?.particulate_matter_25 ?? "-"} 
        `,
    },
    //https://ww2.arb.ca.gov/resources/inhalable-particulate-matter-and-health
    {
      title: <Tooltip title="Particulas menores a 10 micrometros">P10</Tooltip>,
      key: "p10",
      render: (
        _,
        row,
      ) => `${row.weather_log?.air_quality_weather?.particulate_matter_10 ?? "-"} 
        `,
    },
    {
      title: <Tooltip title="Indice EPA">EPA</Tooltip>,
      key: "epa",
      render: (
        _,
        row,
      ) => `${row.weather_log?.air_quality_weather?.us_epa_index ?? "-"} 
        `,
    },
    {
      title: <Tooltip title="Indice DEFRA">DEF</Tooltip>,
      key: "defra",
      render: (
        _,
        row,
      ) => `${row.weather_log?.air_quality_weather?.gb_defra_index ?? "-"} 
        `,
    },
  ];
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Persona",
      children: (
        <Typography.Text>
          {`${assistence.data?.volunteer?.user.person?.name ?? ""} ${assistence.data?.volunteer?.user.person?.f_lastname ?? ""} ${assistence.data?.volunteer?.user.person?.m_lastname ?? ""}  `}
        </Typography.Text>
      ),
    },
  ];

  return (
    <div>
      <Descriptions items={items} />
      <Table
        rowKey={(row) => row.id}
        dataSource={assistence.data?.assistences}
        columns={columns}
        loading={assistence.isLoading}
      />
    </div>
  );
}
