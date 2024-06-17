"use client";
import { Button, Form, Input, Modal, Select, Switch, Table, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";

type TMicrotasks = RouterOutputs["projects"]["getMicroTasks"][0];
type Task = RouterOutputs["projects"]["getTasks"][0];

export default function ProjectMicroTasks({
  project_task,
}: {
  project_task: Task;
}) {
  const microtasks = api.projects.getMicroTasks.useQuery({
    project_task_id: project_task.id,
  });

  const assignVolunteersToMicroTask =
    api.projects.assignVolunteersToMicroTask.useMutation({
      onSuccess() {
        void microtasks.refetch();
      },
    });

  const toggleCompleteMicroTask =
    api.projects.toggleCompleteMicroTask.useMutation({
      onSuccess() {
        void microtasks.refetch();
      },
    });

  const columns: ColumnProps<TMicrotasks>[] = [
    {
      title: "Creado",
      key: "created_at",
      render(_, record) {
        return (
          <Tag>{dayjs.utc(record.created_at).format("DD/MM/YYYY HH:mm")}</Tag>
        );
      },
      width: 100,
    },
    {
      title: "Creador",
      key: "created_by",
      render(_, record) {
        return <Tag>{record.created_by.user.email}</Tag>;
      },
      width: 100,
    },
    {
      title: "Completado",
      dataIndex: "is_completed",
      key: "is_completed",
      render: (_, row) => {
        return (
          <Switch
            loading={toggleCompleteMicroTask.isPending}
            checked={row.is_completed}
            onClick={async () => {
              await toggleCompleteMicroTask.mutateAsync({
                id: row.id,
              });
            }}
            size="small"
            checkedChildren="Completado"
            unCheckedChildren="Pendiente"
          />
        );
      },
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripcion",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Responsables",
      key: "responsibles",
      render(_, record) {
        const ids = record.assigned_to.map((r) => r.id);
        return (
          <Select
            style={{ width: "100%" }}
            mode="multiple"
            placeholder="Responsables"
            options={project_task.assigned_to.map((r) => {
              return { label: r.user.email, value: r.id };
            })}
            onChange={async (value) => {
              await assignVolunteersToMicroTask.mutateAsync({
                id: record.id,
                volunteers: value,
              });
            }}
            defaultValue={ids}
          />
        );
      },
    },
  ];
  const [createModal, setCreateModal] = useState(false);
  const form = Form.useForm<Pick<TMicrotasks, "name" | "description">>()[0];
  const createMicroTask = api.projects.createMicroTask.useMutation({
    onSuccess() {
      void microtasks.refetch();
    },
  });

  return (
    <div className="tw-bg-white tw-p-1 tw-bg-opacity-10">
      <Modal
        title="Crear Micro Tarea"
        open={createModal}
        onOk={() => form.submit()}
        onCancel={() => setCreateModal(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            void createMicroTask.mutateAsync({
              name: values.name,
              description: values.description,
              task_id: project_task.id,
            });
            setCreateModal(false);
          }}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: "Por favor ingrese el nombre" }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Descripcion" name="description">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <Button onClick={() => setCreateModal(true)} type="primary" size="small">
        Crear Micro Tarea
      </Button>
      <Table
        //totals
        pagination={{
          defaultPageSize: 10,
          total: microtasks.data?.length,
          showTotal: (total) => `Total ${total} micro tareas`,
        }}
        loading={microtasks.isLoading}
        rowKey="id"
        dataSource={microtasks.data}
        columns={columns}
      />
    </div>
  );
}
