"use client";
import { Button, DatePicker, Form, Popconfirm, Space, Table, Tag } from "antd";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";

//utc dayjs
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import React from "react";
import { type RouterOutputs } from "~/server/api/root";
type ProjectsDates = Omit<
  RouterOutputs["projects"]["myProjects"][0]["project_dates"][0],
  "project_id"
>;

export default function DatesComponent({
  onFinish,
  projectDates,
  upperDate,
  lowerDate,
}: {
  onFinish: (values: {
    start_date: dayjs.Dayjs | undefined;
    end_date: dayjs.Dayjs | undefined;
  }) => void;
  projectDates: ProjectsDates[];
  upperDate?: dayjs.Dayjs;
  lowerDate?: dayjs.Dayjs;
}) {
  const formCreateProjectDate = Form.useForm<{
    start_date: dayjs.Dayjs | undefined;
    end_date: dayjs.Dayjs | undefined;
  }>()[0];
  const projectDatesColumns: ColumnProps<ProjectsDates>[] = [
    {
      title: "Fecha de inicio",
      key: "start_date",
      render: (_: unknown, project: ProjectsDates) => {
        return (
          <>{dayjs.utc(project.tracking_date.start_date).format("DD/MM/YYYY")}</>
        );
      },
    },
    {
      title: "Fecha de fin",
      key: "end_date",
      render: (_: unknown, project: ProjectsDates) => {
        return (
          <>{dayjs.utc(project.tracking_date.end_date).format("DD/MM/YYYY")}</>
        );
      },
    },
    {
      title: "Dias",
      key: "days",
      render: (_: unknown, project: ProjectsDates) => {
        // Calculamos los dias
        const start = dayjs.utc(project.tracking_date.start_date);
        const end = dayjs.utc(project.tracking_date.end_date);
        const diff = end.diff(start, "days") + 1;
        return <>{diff}</>;
      },
    },
    {
      title: "Estado",
      key: "state",
      render: (_: unknown, project: ProjectsDates) => {
        return (
          <Tag color={project.active ? "green" : "red"}>
            {project.active ? "Activo" : "Inactivo"}
          </Tag>
        );
      },
    },
  ];
  const minDate = Form.useWatch("start_date", formCreateProjectDate);

  return (
    <div>
      <div>
        <div className="tw-flex">
          <Form form={formCreateProjectDate} onFinish={onFinish}>
            <Space.Compact>
              <Form.Item
                name="start_date"
                label="Fecha de inicio"
                rules={[{ required: true }]}
              >
                <DatePicker
                  format={"DD/MM/YYYY"}
                  onChange={(date) => {
                    formCreateProjectDate.setFieldsValue({
                      end_date: date,
                    });
                  }}
                  maxDate={upperDate}
                  minDate={lowerDate}
                />
              </Form.Item>
              <Form.Item
                name="end_date"
                label="Fecha de fin"
                rules={[{ required: true }]}
              >
                <DatePicker
                  format={"DD/MM/YYYY"}
                  // Min date is the start date
                  minDate={minDate ?? lowerDate}
                  maxDate={upperDate}
                />
              </Form.Item>

              {projectDates.find((v) => v.active) ? (
                <Popconfirm
                  title="¿Desea crear una nueva fecha? Reemplazara la anterior fecha"
                  onConfirm={() => {
                    formCreateProjectDate.submit();
                  }}
                  okText="Crear"
                  cancelText="Cancelar"
                >
                  <Button type="primary">Crear</Button>
                </Popconfirm>
              ) : (
                <Button type="primary" htmlType="submit">
                  Crear
                </Button>
              )}
            </Space.Compact>
          </Form>
        </div>
        <Table columns={projectDatesColumns} dataSource={projectDates ?? []} />
      </div>
    </div>
  );
}
