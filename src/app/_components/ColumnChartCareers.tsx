'use client'
import { Card } from "antd";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { type ColumnConfig } from "@ant-design/plots";
const Column = dynamic(
  () => import("@ant-design/plots").then((mod) => mod.Column),
  { ssr: false }
)
type TChartData = { type: string, value: number }
export default function ColumnChartCareers() { 
  const volunteers = api.volunteer.list.useQuery(); 
  const [data, setdata] = useState<TChartData[]>([]);
  const config: ColumnConfig = {
    data,
    xField: 'type',
    yField: 'value',
    label: {
      text: (originData: TChartData) => {
        const val = originData.value;
        if (val < 0.05) {
          return `${(val * 100).toFixed(1)}%`;
        }
        return '';
      },
      offset: 15,

    },
    scale: {
      y: {
        padding: 1
      }
    },
    legend: false,
  };
  useEffect(() => {
    if (!volunteers.data) {
      return;
    }    
    //Calculate how many people are from same career
    const chartData: TChartData[] = [];
    volunteers.data.forEach((volunteer) => {
      volunteer.careers.forEach((career) => {
        const index = chartData.findIndex((data) => data.type === career.name);
        if (index === -1) {
          chartData.push({ type: career.name, value: 1 });
          return;
        }
        const levalue = chartData[index]
        if (levalue !== undefined) {
          levalue.value++;
        }
      })
    })
       
    
    setdata(chartData);
  }, [volunteers.data, volunteers.isLoading])
    
  return <Card
    
    title="Recuento por carrera"
    size="small"
    className="tw-overflow-auto"
  >
    {data.length > 0 ? <Column {...config} data={data} /> : volunteers.isLoading ? "Cargando..." : null}
  </Card>
}