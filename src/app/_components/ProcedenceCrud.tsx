"use client";

import { Button, Form, Input, Popconfirm, Table } from "antd";
import { type ColumnProps } from "antd/es/table";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { useGlobalContext } from "../globalContext";

type Procedencias = RouterOutputs["volunteer"]["procedences"][0];

export default function ProcedenceCrud() {
  const procedenceList = api.volunteer.procedences.useQuery();
  const global = useGlobalContext();
  const utils = api.useUtils();
  const upsertProcedence = api.volunteer.upsertProcedence.useMutation({
    onSuccess() {
      void utils.volunteer.procedences.refetch();
      void utils.volunteer.list.refetch();
      void global?.messageApi.success("Procedencia actualizada");
    },
  });
  const deleteProcedence = api.volunteer.deleteProcedence.useMutation({
    onSuccess() {
      void utils.volunteer.procedences.refetch();
      void utils.volunteer.list.refetch();
      void global?.messageApi.success("Procedencia eliminada");
    },
  });

  const columns: ColumnProps<Procedencias>[] = [
    {
      title: "Procedencia",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, procedence) => {
        return (
          <div className="tw-flex tw-gap-2">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                form.setFieldsValue({
                  id: procedence.id,
                  name: procedence.name,
                });
              }}
            >
              Editar
            </Button>
            <Popconfirm
              title="¿Desea eliminar esta procedencia?"
              onConfirm={() => {
                void deleteProcedence.mutateAsync({ id: procedence.id });
              }}
            >
              <Button type="primary" size="small" danger>
                Eliminar
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const [form] = Form.useForm();
  const id = Form.useWatch("id", form) as string | undefined;
  return (
    <div>
      <div className="tw-flex tw-w-full">
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={(values) => {
            void upsertProcedence.mutateAsync(
              values as { name: string; id?: string },
            );
          }}
          className="tw-w-full"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Por favor, ingrese un nombre" },
            ]}
            name="name"
            className="tw-w-full"
            label="Procedencia"
          >
            <Input
              className="tw-w-full"
              placeholder="Nombre de la procedencia Ej: Universidad Franz Tamayo"
            />
          </Form.Item>
          <div className="tw-flex">
            <Button
              loading={upsertProcedence.isPending || deleteProcedence.isPending}
              className="tw-ml-auto"
              htmlType="submit"
              type="primary"
            >
              {id ? "Actualizar" : "Crear"}
            </Button>
            {id && (
              <Button
                className="tw-ml-2"
                onClick={() => {
                  form.resetFields();
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </Form>
      </div>
      <Table
        rowKey="id"
        loading={procedenceList.isFetching}
        dataSource={procedenceList.data}
        columns={columns}
      />
    </div>
  );
}
