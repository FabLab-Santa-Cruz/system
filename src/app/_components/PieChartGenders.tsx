"use client";
import dynamic from 'next/dynamic';

import { Card } from "antd";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { type PieConfig } from "@ant-design/plots";
const Pie = dynamic(
  () => import("@ant-design/plots").then((mod) => mod.Pie),
  { ssr: false }
)
export default function PieChartGenders() {
  const volunteers = api.volunteer.list.useQuery(); 

  const config: PieConfig = {
    title: {
      visible: true,
      text: "Generos",
    },
    angleField: "value",
    colorField: "type",
    label: {
      text: "type",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {

      color: {

        title: "Genero",
        position: "right",
        rowPadding: 5,
      },
    },
  };
  useEffect(() => {
    if (!volunteers.data) {
      return;
    }    
    //Calculate how many genders first
    const genders = volunteers.data.reduce((prev, curr) => {
      if (!curr) return prev
      if(!curr.user.person?.gender?.name) return prev
      if (prev[curr.user.person?.gender?.name]) {
        prev[curr.user.person?.gender?.name] += 1;
      } else {
        prev[curr.user.person?.gender?.name] = 1;
      }
      return prev;
    }, {} as Record<string, number>)
    //Cast to array with value and type
    const data = Object.entries(genders).map(([key, value]) => ({
      type: key,
      value,
    }))
    
    setdata(data)
  }, [volunteers.data, volunteers.isLoading])
  const [data, setdata] = useState<{
    type: string;
    value: number;
  }[]>([])

  return <Card
    size="small"
    title="Recuento genero"
  >
    
    {data.length > 0 ? <Pie {...config} data={data} /> : volunteers.isLoading ? "Cargando..." : null}
  </Card>;
  
}
