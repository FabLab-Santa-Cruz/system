"use client";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
} from "antd";
import Table, { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useGlobalContext } from "~/app/state/globalContext";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import DatesComponent from "./DatesComponent";
import ProjectMicroTasks from "./ProjectMIcroTasks";

type Task = RouterOutputs["projects"]["getTasks"][0];
type TProject = RouterOutputs["projects"]["myProjects"][0];
export default function ProjectTasks({ project }: { project: TProject }) {
  const deleteTask = api.projects.deleteTask.useMutation({
    onSuccess: () => {
      void tasks.refetch();
      setSelectedTask(null);
    },
  });

  const columns: ColumnProps<Task>[] = [
    {
      title: "Creado",
      dataIndex: "created_at",
      key: "created_at",
      render: (_: unknown, row) => {
        return <Tag>{dayjs(row.created_at).format("DD/MM/YYYY HH:mm")}</Tag>;
      },
      width: 100,
    },
    {
      title: "Creador",
      dataIndex: "creator",
      key: "creator",
      render: (task: unknown, row) => {
        return <Tag>{row.created_by.user.email}</Tag>;
      },
      width: 100,
    },

    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Duracion",
      key: "fechas",
      render: (_: unknown, row) => {
        const hasDate = row.project_task_dates.find((v) => v.active);
        const click = () => {
          setSelectedTask(row);
          setModalFechas(true);
        };
        if (!hasDate)
          return (
            <Button size="small" onClick={click}>
              Sin fecha
            </Button>
          );

        return (
          <div>
            <Space.Compact>
              <Button size="small" onClick={click}>
                {dayjs
                  .utc(hasDate.tracking_date.start_date)
                  .format("DD/MM/YYYY")}
              </Button>
              <Button size="small" onClick={click}>
                {dayjs.utc(hasDate.tracking_date.end_date).format("DD/MM/YYYY")}
              </Button>
            </Space.Compact>
          </div>
        );
      },
    },
    {
      // Asignados
      title: "Asignados",
      key: "volunteers",
      render: (task: unknown, row) => {
        const initialIds = row.assigned_to.map((r) => r.id);
        return (
          <Select
            size="small"
            mode="multiple"
            style={{ width: "100%" }}
            loading={assignVolunteersToTask.isPending}
            defaultValue={initialIds}
            onChange={async (ids) => {
              await assignVolunteersToTask.mutateAsync({
                id: row.id,
                workers: ids,
              });
            }}
            options={project.workers.map((r) => {
              return { label: r.user.email, value: r.id };
            })}
          />
        );
      },
    },
    {
      title: "Dias",
      key: "days",
      render: (task: unknown, row) => {
        const active = row.project_task_dates.find((v) => v.active);
        if (!active) return null;
        const start = dayjs.utc(active.tracking_date.start_date);
        const end = dayjs.utc(active.tracking_date.end_date);
        return <div>{Math.abs(start.diff(end, "day")) + 1}</div>;
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, row) => {
        return (
          <div>
            <Space.Compact>
              
              <Popconfirm
                title="¿Desea eliminar esta tarea?"
                onConfirm={() => {
                  void deleteTask.mutateAsync({ id: row.id });
                }}
              >
                <Button danger type="primary" size="small">
                  Eliminar
                </Button>
              </Popconfirm>
            </Space.Compact>
          </div>
        );
      },
    },
  ];

  const tasks = api.projects.getTasks.useQuery({ id: project.id });

  const [modal, setModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formCreateTask] = Form.useForm();
  const global = useGlobalContext();
  const createTask = api.projects.createTask.useMutation({
    onSuccess: () => {
      void global?.messageApi.success("Tarea agregada");
      setModal(false);
      void tasks.refetch();
      formCreateTask.resetFields();
    },
  });

  const onFinishCreateTask = async (values: {
    name: string;
    description: string;
  }) => {
    await createTask.mutateAsync({
      name: values.name,
      description: values.description,
      project_id: project.id,
    });
  };

  const createProjectTaskDate = api.projects.createProjectTaskDate.useMutation({
    onSuccess: async () => {
      void global?.messageApi.success("Fecha de tarea agregada");

      const data = await tasks.refetch();
      if (selectedTask) {
        setSelectedTask(
          data.data?.find((p) => p.id === selectedTask?.id) ?? null,
        );
      }
    },
  });

  const onFinish = (values: {
    start_date: dayjs.Dayjs | undefined;
    end_date: dayjs.Dayjs | undefined;
  }) => {
    if (!values.start_date || !values.end_date) {
      void global?.messageApi.error("Por favor, ingrese una fecha");
      return;
    }
    if (selectedTask) {
      void createProjectTaskDate.mutateAsync({
        id: selectedTask.id,
        start_date: values.start_date?.format("YYYY-MM-DD"),
        end_date: values.end_date?.format("YYYY-MM-DD"),
      });
    }
  };
  useEffect(() => {
    setSelectedTask(null);
  }, [project]);

  const activeDateProject = project.project_dates.find((v) => v.active);
  
  const formVolunteers = Form.useForm<{
    volunteers: string[];
  }>()[0];
  const assignVolunteersToTask =
    api.projects.assignVolunteersToTask.useMutation({
      onSuccess: async () => {
        void global?.messageApi.success("Voluntarios asignados");
        
        formVolunteers.resetFields();

        const data = await tasks.refetch();
        if (selectedTask) {
          setSelectedTask(
            data.data?.find((p) => p.id === selectedTask?.id) ?? null,
          );
        }
      },
    });

  const [modalFechas, setModalFechas] = useState(false);
  return (
    <div className="tw-flex tw-w-full tw-gap-2 tw-bg-white tw-bg-opacity-20 tw-p-1 ">
      <Modal
        title="Asignar fechas"
        open={modalFechas}
        onCancel={() => {
          setModalFechas(false);
        }}
        footer={null}
      >
        {selectedTask && activeDateProject ? (
          <DatesComponent
            lowerDate={
              activeDateProject?.tracking_date.start_date
                ? dayjs.utc(activeDateProject.tracking_date.start_date)
                : undefined
            }
            upperDate={
              activeDateProject?.tracking_date.end_date
                ? dayjs.utc(activeDateProject.tracking_date.end_date)
                : undefined
            }
            projectDates={selectedTask.project_task_dates}
            onFinish={onFinish}
          />
        ) : (
          <div>
            <p>No hay tarea seleccionada o no hay fecha activa de proyecto</p>
          </div>
        )}
      </Modal>

      <Modal
        title={
          selectedTask?.name
            ? `Editar Tarea: ${selectedTask.name}`
            : "Crear Tarea"
        }
        open={modal}
        onOk={() => formCreateTask.submit()}
        onCancel={() => setModal(false)}
      >
        <Form
          form={formCreateTask}
          onFinish={onFinishCreateTask}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Nombre"
            rules={[
              { required: true, message: "Por favor, ingrese un nombre" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese una descripción",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <div className="tw-w-full">
        <Button
          onClick={() => {
            setModal(true);
            setSelectedTask(null);
          }}
          type="primary"
          size="small"
        >
          Crear Tarea
        </Button>
        <Table
          size="small"
          rowKey="id"
          expandable={{
            // Show all the comments
            expandedRowRender: (record) => {
              return <ProjectMicroTasks project_task={record} />;
            },
          }}
          pagination={{
            defaultCurrent: 1,
            pageSize: 10,
            showTotal: (total) => `Total ${total} tareas`,
          }}
          loading={tasks.isLoading}
          columns={columns}
          dataSource={tasks.data}
        />
      </div>
    </div>
  );
}
