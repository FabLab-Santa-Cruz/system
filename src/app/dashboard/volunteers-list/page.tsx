"use client";
import {
  Button,
  Card,
  Image,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
  Typography,
} from "antd";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";

import { useState } from "react";
import CareersCrud from "~/app/_components/CareersCrud";
import ColumnChartCareers from "~/app/_components/ColumnChartCareers";
import ColumnChartProcedences from "~/app/_components/ColumnChartProcedences";
import PieChartGenders from "~/app/_components/PieChartGenders";
import ProcedenceCrud from "~/app/_components/ProcedenceCrud";
import VolunteersRequests from "~/app/_components/VolunteersRequests";
import { useGlobalContext } from "~/app/globalContext";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";

type Volunteer = RouterOutputs["volunteer"]["list"][0];
//=>
export default function List() {
  const genders = api.person.listGenders.useQuery();
  const lista = api.volunteer.list.useQuery();
  const careers = api.career.list.useQuery();
  const assignCode = api.volunteer.assignCode.useMutation({
    onSuccess() {
      void lista.refetch();
      void global?.messageApi.success("Código asignado");
    },
  });
  const global = useGlobalContext();
  const procedence = api.volunteer.procedences.useQuery();
  const util = api.useUtils();

  const procedenceVolunteer = api.volunteer.procedenceVolunteer.useMutation({
    onSuccess() {
      void util.volunteer.procedences.refetch();
      void util.volunteer.list.refetch();
      void global?.messageApi.success("Procedencia actualizada");
    },
  });
  const careersVolunteer = api.volunteer.careersVolunteer.useMutation({
    onSuccess() {
      void util.volunteer.list.refetch();
      void global?.messageApi.success("Carrera actualizada");
    },
  })

  const columns: ColumnProps<Volunteer>[] = [
    {
      title: "Avatar",
      key: "avatar",
      width: 60,
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
      width: 100,
      render(_, row) {
        return <>{row.user.person?.name}</>;
      },
    },
    {
      title: "Apellido(s)",
      key: "lastnames",
      width: 100,
      render(_, row) {
        return (
          <Typography.Text>{`${row.user.person?.f_lastname ?? ""} ${
            row.user.person?.m_lastname ?? ""
          }`}</Typography.Text>
        );
      },
    },
    {
      title: "Contacto",
      key: "email",
      width: 150,
      render(_, row) {
        return (
          <div className="tw-flex tw-flex-col">
            <Typography.Text>
              {row.user.person?.emails?.map((e) => e.mail).join(", ")}
            </Typography.Text>
            <Typography.Text>
              {row.user.person?.phones?.map((p) => p.phone).join(", ")}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      title: "Habilidades",
      width: 150,
      key: "procedences",
      render(_, row) {
        return row.skills.map((s) => <Tag key={s.id}>{s.name}</Tag>);
      },
    },
    {
      title: "Carrera(s)",
      key: "carrera",
      width: 150,
      render(_, row) {
        return <Select
          loading={careers.isLoading}
          className="tw-w-full"
          mode="multiple"
          placeholder="Carreras"
          options={careers.data?.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
          defaultValue={row.careers.map((c) => c.id)}
          onChange={(v) => {
            void careersVolunteer.mutateAsync({
              id: row.id,
              ids: v,
            });
          }}
        />;
      },
    },
    {
      title: "Procedencia(s)",
      key: "procedence",
      width: 150,
      render(_, row) {
        return (
          <Select
            loading={procedence.isLoading}
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
      title: "Genero",
      key: "gender",
      width: 80,
      filters: genders.data?.map((g) => ({
        text: g.name,
        value: g.name,
      })),
      onFilter: (value, row) => row.user.person?.gender?.name === value,
      render(_: unknown, row) {
        return <>{row.user.person?.gender?.name ?? "-"}</>;
      },
    },
    {
      title: "Creado",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
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
              Projectos
            </Button>
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

  const [modalProcedence, setModalProcedence] = useState(false);
  const [modalCareers, setModalCareers] = useState(false);
  return (
    <div className="tw-m-4 tw-w-full">
      <Modal
        title="Procedencia"
        open={modalProcedence}
        onCancel={() => setModalProcedence(false)}
        footer={null}
      >
        {/* Crud de procedencia... tabla e input */}
        <ProcedenceCrud />
      </Modal>
      <Modal
        title="Carreras"
        open={modalCareers}
        onCancel={() => setModalCareers(false)}
        footer={null}
      >
        <CareersCrud />
      </Modal>
      <VolunteersRequests />
      <Card
        title={
          <div className="tw-flex tw-items-center tw-gap-2">
            <Typography.Text>Lista de voluntarios</Typography.Text>
            <Button
              type="primary"
              size="small"
              onClick={() => setModalProcedence(true)}
            >
              Procedencia
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => setModalCareers(true)}
            >
              Carreras
            </Button>
          </div>
        }
        size="small"
      >
        <div className="tw-overflow-auto">
          <Table
            size="small"
            pagination={false}
            scroll={{ y: 500 }}
            virtual
            rowKey={(v) => v.id}
            loading={lista.isLoading}
            dataSource={lista.data}
            columns={columns}
          />
        </div>
      </Card>
      <Card size="small" title="Algunas estadisticas">
        <div className="tw-flex tw-gap-2  tw-overflow-auto">
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
    </div>
  );
}
