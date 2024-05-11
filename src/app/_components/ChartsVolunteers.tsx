"use client";
import { Card } from "antd";
import ColumnChartCareers from "~/app/_components/ColumnChartCareers";
import ColumnChartProcedences from "~/app/_components/ColumnChartProcedences";
import PieChartGenders from "~/app/_components/PieChartGenders";

export default function ChartsVolunteers() {
  return (
    
      <Card size="small" title="Algunas estadisticas">
        <div className="tw-flex tw-w-full  tw-gap-2  tw-overflow-auto">
          <div className="tw-basis-1/3">
            <PieChartGenders />
          </div>
          <div className="tw-basis-1/3">
            <ColumnChartProcedences />
          </div>
          <div className="tw-basis-1/3">
            <ColumnChartCareers />
          </div>
        </div>
      </Card>
    
  );
}
