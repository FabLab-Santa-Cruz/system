"use client";
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Tag } from "antd";
import Table, { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "~/app/state/globalContext";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import DatesComponent from "./DatesComponent";

type Task = RouterOutputs["projects"]["getTasks"][0];

export default function ProjectTasks({ project_id }: { project_id: string }) {

  const deleteTask = api.projects.deleteTask.useMutation({
    onSuccess: () => {
      void tasks.refetch();
      setSelectedTask(null);
    },
  });

  const columns: ColumnProps<Task>[] = [
    {
      title: "Creador",
      dataIndex: "creator",
      key: "creator",
      render: (task: unknown, row) => {
        return <Tag>{row.created_by.user.email}</Tag>;
      },
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
      render: (task: unknown, row) => {
        const hasDate = row.project_task_dates.find((v) => v.active);
        return (
          <div>
            {hasDate ? (
              <>
                <Tag color="blue">
                  {dayjs
                    .utc(hasDate.tracking_date.start_date)
                    .format("DD/MM/YYYY")}
                </Tag>
                <Tag color="blue">
                  {dayjs
                    .utc(hasDate.tracking_date.end_date)
                    .format("DD/MM/YYYY")}
                </Tag>
              </>
            ) : null}
          </div>
        );
      },
    },
    {
      // Asignados
      title: "Asignados",
      key: "volunteers",
      render: (task: unknown, row) => {
        return (
          <div>
            {row.assigned_to.map((volunteer) => {
              return (
                <Tag color="blue" key={volunteer.id}>
                  {volunteer.user.email}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Dias",
      key: "days",
      render: (task: unknown, row) => {
        const active = row.project_task_dates.find((v) => v.active);
        if (!active) return null
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
              <Button
                size="small"
                onClick={() => {
                  setSelectedTask(row);
                  setModalVolunteers(true);
                  formVolunteers.setFieldsValue({
                    volunteers: row.assigned_to.map((volunteer) => {
                      return volunteer.id;
                    })
                  })
                }}
              >
                Ver
              </Button>
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

  const tasks = api.projects.getTasks.useQuery({ id: project_id });
  const volunteersInProject = api.projects.getVolunteersInProject.useQuery({
    id: project_id,
  });
  const project = api.projects.getProject.useQuery({ id: project_id });

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
      project_id: project_id,
    });
  };

  const createProjectTaskDate = api.projects.createProjectTaskDate.useMutation({
    onSuccess: async () => {
      void global?.messageApi.success("Fecha de tarea agregada");
      
      const data = await tasks.refetch();
      if (selectedTask) {
        setSelectedTask(data.data?.find((p) => p.id === selectedTask?.id) ?? null);
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
  }, [project_id]);

  const activeDateProject = project.data?.project_dates.find((v) => v.active);
  const [modalVolunteers, setModalVolunteers] = useState(false);
  const formVolunteers = Form.useForm<{
    volunteers: string[];
  }>()[0];
  const assignVolunteersToTask = api.projects.assignVolunteersToTask.useMutation({
    onSuccess: async () => {
      void global?.messageApi.success("Voluntarios asignados");
      setModalVolunteers(false);
      formVolunteers.resetFields();

      const data = await tasks.refetch();
      if (selectedTask) {
        setSelectedTask(data.data?.find((p) => p.id === selectedTask?.id) ?? null);
      }

    },
  });

  const onFinishFormVolunteers = async (values: {
    volunteers: string[];
  }) => {
    if (selectedTask) {
      await assignVolunteersToTask.mutateAsync({
        id: selectedTask.id,
        workers: values.volunteers,
      })
    }
    setModalVolunteers(false);

  }
  return (
    <div className="tw-flex tw-gap-2">
      <div className="tw-basis-2/3">
        <Card title="Tareas">
          <div>
            {/* Otro modal, pero para los voluntarios */}
            <Modal
              title="Voluntarios a asignar a Tarea"
              open={modalVolunteers}
              onCancel={() => {
                setModalVolunteers(false);
              }}
              onOk={() => {
                formVolunteers.submit();
              }}
            >
              <Form form={formVolunteers} onFinish={onFinishFormVolunteers}>
                <Form.Item name={"volunteers"}>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Selecciona voluntarios"
                    optionLabelProp="label"
                    options={volunteersInProject.data?.map((volunteer) => {
                      return {
                        label: volunteer.user.email,
                        value: volunteer.id,
                      };
                    })}
                  />
                </Form.Item>
              </Form>
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

            <Button
              onClick={() => {
                setModal(true);
                setSelectedTask(null);
              }}
            >
              Crear Tarea
            </Button>
            <Table
              size="small"
              rowKey="id"
              onRow={(row) => ({
                onClick: () => {
                  setSelectedTask(row);
                },
              })}
              loading={tasks.isLoading}
              columns={columns}
              dataSource={tasks.data}
            />
          </div>
        </Card>
      </div>
      <div className="tw-basis-1/3">
        <Card
          title={
            selectedTask
              ? `Fechas de tarea: ${selectedTask.name}`
              : `Fechas de tarea`
          }
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
        </Card>
      </div>
    </div>
  );
}
