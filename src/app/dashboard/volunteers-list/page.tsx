"use client";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";

import { useState } from "react";
import ProcedenceCrud from "~/app/_components/ProcedenceCrud";
import VolunteersRequests from "~/app/_components/VolunteersRequests";
import { useGlobalContext } from "~/app/globalContext";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { WithUrl } from "~/utils/withUrl";

type Volunteer = RouterOutputs["volunteer"]["list"][0];
//=>
export default function List() {
  const lista = api.volunteer.list.useQuery();
  const assignCode = api.volunteer.assignCode.useMutation({
    onSuccess() {
      void lista.refetch();
      void global?.messageApi.success("Código asignado");
    },
  });
  const global = useGlobalContext();
  const procedence = api.volunteer.procedences.useQuery();
  const procedenceVolunteer = api.volunteer.procedenceVolunteer.useMutation({
    onSuccess() {
      void procedence.refetch();
      void global?.messageApi.success("Procedencia actualizada");
    },
  })
  const upserteProcedence = api.volunteer.upsertProcedence.useMutation({
    onSuccess() {
      void procedence.refetch();
      void global?.messageApi.success("Procedencia actualizada");
    },
  });

  const columns: ColumnProps<Volunteer>[] = [
    {
      title: "Avatar",
      key: "avatar",
      render(_, row) {
        return (
          <div>
            <Image alt="avatar" width={40} src={row.user.image ?? ""} />
          </div>
        );
      },
    },
    {
      title: "Nombre",
      key: "name",
      render(_, row) {
        return <>{row.user.person?.name}</>;
      },
    },
    {
      title: "Apellido(s)",
      key: "skills",
      render(_, row) {
        return (
          <Typography.Text>{`${row.user.person?.f_lastname ?? ""} ${
            row.user.person?.m_lastname ?? ""
          }`}</Typography.Text>
        );
      },
    },
    {
      title: "Correo",
      key: "email",
      render(_, row) {
        return (
          <Typography.Text>
            {row.user.person?.emails?.map((e) => e.mail).join(", ")}
          </Typography.Text>
        );
      },
    },
    {
      title: "Habilidades",
      key: "procedences",
      render(_, row) {
        return row.skills.map((s) => <Tag key={s.id}>{s.name}</Tag>);
      },
    },
    {
      title: "Projectos",
      key: "phones",
      render(_, row) {
        return (
          <Typography.Text>
            {row.user.person?.phones?.map((p) => p.phone).join(", ")}
          </Typography.Text>
        );
      },
    },
    {
      title: "Procedencia(s)",
      key: "procedence",
      render(_, row) {
        return (
          <Select
            className="tw-w-full"
            mode="multiple"
            placeholder="Procedencias"
            options={procedence.data?.map((p) => ({
              label: p.name,
              value: p.id,
            }))}
            defaultValue={row.procedence.map((v) => v.id)}
            onChange={(v) => {
              
              void procedenceVolunteer.mutateAsync({
                id: row.id,
                ids: v,
              });
            }}
            //value={row.procedence.map((v) => v.id)}
          />
        );
      },
    },

    {
      title: "Codigo de asistencia",
      width: 150,
      key: "assistance_code",
      render(_, row) {
        return (
          <Input
            placeholder="Asigna un codigo de asistencia"
            defaultValue={row.biometric_id ?? ""}
            disabled={assignCode.isPending}
            onKeyDown={(e) => {
              if (e.currentTarget.value === row.biometric_id) return;
              if (e.key === "Enter") {
                void assignCode.mutateAsync({
                  id: row.id,
                  code: e.currentTarget.value,
                });
              }
            }}
            onBlur={(e) => {
              if (e.target.value === row.biometric_id) return;
              void assignCode.mutateAsync({
                id: row.id,
                code: e.target.value,
              });
            }}
          />
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
            {dayjs(volunteer.created_at).format("DD/MM/YYYY")}
          </Typography.Text>
        );
      },
    },
    {
      title: "Acciones",
      key: "actions",
      width: 100,
      render: (_: unknown, volunteer: Volunteer) => {
        return (
          <div>
            <Button type="primary" size="small">
              Asistencia
            </Button>
            <Popconfirm
              title={`¿Estas seguro de finalizar la pasantia de ${volunteer.user.person.name ?? ""}?`}
            >
              <Button type="primary" danger size="small">
                Finalizar
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const [modalProcedencia, setModalProcedencia] = useState(false);
  //const [selected, setSelected] = useState<Volunteer>();
  return (
    <div className="tw-m-4 tw-w-full">
      <Modal
        title="Procedencia"
        open={modalProcedencia}
        onCancel={() => setModalProcedencia(false)}
        footer={null}
      >
        {/* Crud de procedencia... tabla e input */}
        <ProcedenceCrud />
      </Modal>
      <VolunteersRequests />
      <Card
        title={
          <div className="tw-flex tw-items-center tw-gap-2">
            <Typography.Text>Lista de voluntarios</Typography.Text>
            <Button size="small" onClick={() => setModalProcedencia(true)}>
              Procedencia
            </Button>
          </div>
        }
        size="small"
      >
        <Table
          rowKey={(v) => v.id}
          loading={lista.isLoading}
          dataSource={lista.data}
          columns={columns}
        />
      </Card>
    </div>
  );
}
