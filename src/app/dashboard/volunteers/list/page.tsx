"use client";
import { Button, Form, Input, Modal, Table, Typography } from "antd";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";

import { useState } from "react";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";

type Volunteer = RouterOutputs["volunteer"]["list"][0];
type VEmail = { email: string; comment: string };
type VPhone = { phone: string; comment: string };
export default function List() {
  const lista = api.volunteer.list.useQuery();
  const columns: ColumnProps<Volunteer>[] = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Apellido",
      dataIndex: "lastname",
    },
    {
      title: "Emails",
      key: "emails",
      render: (_: unknown, volunteer: Volunteer) => {
        const emails = volunteer.emails as VEmail[];
        return (
          <>
            {emails.map((email) => (
              <Typography.Text key={email.email}>{email.email}</Typography.Text>
            ))}
          </>
        );
      },
    },
    {
      title: "Telefonos",
      dataIndex: "phones",
      key: "phones",
      render: (_: unknown, volunteer: Volunteer) => {
        const phones = volunteer.phones as VPhone[];
        return (
          <>
            {phones.map((phone) => (
              <Typography.Text key={phone.phone}>{phone.phone}</Typography.Text>
            ))}
          </>
        );
      },
    },
    {
      title: "Procedencia",
      dataIndex: "procedence",
      key: "procedence",
      render: (_: unknown, volunteer: Volunteer) => {
        return (
          <Typography.Text>
            {volunteer.procedence.map((p) => p.name).join(", ")}
          </Typography.Text>
        );
      },
    },
    {
      title: "Fecha de nacimiento",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (_: unknown, volunteer: Volunteer) => {
        if (!volunteer.birthdate) return <Typography.Text>N/A</Typography.Text>;
        return (
          <Typography.Text>
            {dayjs(volunteer.birthdate).format("DD/MM/YYYY")}
          </Typography.Text>
        );
      },
    },
    {
      title: "Creado",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: unknown, volunteer: Volunteer) => {
        return (
          <Typography.Text>
            {dayjs(volunteer.createdAt).format("DD/MM/YYYY")}
          </Typography.Text>
        );
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, volunteer: Volunteer) => {
        return (
          <div>
            <Button
              onClick={() => {
                setSelected(volunteer);
                setModal(true);
              }}
            >
              Editar
            </Button>
          </div>
        );
      },
    },
  ];
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState<Volunteer>();
  return (
    <div className="tw-m-4">
      <Modal
        title={`${selected ? "Editar" : "Crear"} voluntario`}
        open={modal}
        onOk={() => setModal(false)}
        onCancel={() => setModal(false)}
      >
        <Form>
          <Form.Item name="name" label="Nombre">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        loading={lista.isLoading}
        dataSource={lista.data}
        columns={columns}
      />
    </div>
  );
}
