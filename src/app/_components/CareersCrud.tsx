"use client";

import { Button, Form, Input, Popconfirm, Table } from "antd";
import { type ColumnProps } from "antd/es/table";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { useGlobalContext } from "../state/globalContext";

type Career = RouterOutputs["career"]["list"][0];
export default function CareersCrud() {
  const careersList = api.career.list.useQuery();
  const utils = api.useUtils();
  const global = useGlobalContext();
  const upsertCareer = api.career.upsert.useMutation({
    onSuccess: () => {
      void utils.career.list.refetch();
      void utils.volunteer.list.refetch();
      void global?.messageApi.success("Carrera actualizada/creada correctamente");
      form.resetFields();
    },
  });
  const deleteCareer = api.career.delete.useMutation({
     onSuccess: async () => {
      void utils.volunteer.list.refetch();
      void utils.career.list.refetch();
      void global?.messageApi.success("Carrera eliminada");
    },
  });

  const columns: ColumnProps<Career>[] = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Acciones",
      width: 200,
      key: "actions",
      render: (_, row) => {
        return (
          <div className="tw-flex tw-gap-2">
            <Button
            
              size="small"
              onClick={() => {
                form.setFieldsValue(row);
              }}
            >Editar</Button>
            <Popconfirm
              title="¿Desea eliminar esta carrera?"
              onConfirm={async () => {
                void deleteCareer.mutateAsync({ id: row.id });
              }}
            >
              <Button size="small" type="primary" danger>
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
      <Form
        form={form}
        labelCol={{ span: 4 }}
        onFinish={(values) => {
          void upsertCareer.mutateAsync(
            values as {
              id: string;
              name: string;
            },
          );
        }}
        className="tw-w-full"
      >
        <Form.Item name={"id"} hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name={"name"}
          label="Nombre"
          rules={[{ required: true, message: "Por favor, ingrese un nombre" }]}
          className="tw-w-full"
        >
          <Input className="tw-w-full" />
        </Form.Item>
        <div className="tw-flex">
          <Button
            loading={upsertCareer.isPending || deleteCareer.isPending}
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
      <Table
        rowKey={(row) => row.id}
        loading={careersList.isFetching}
        columns={columns} dataSource={careersList.data} />
    </div>
  );
}
