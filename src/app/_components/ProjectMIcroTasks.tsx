"use client";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Popover,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { DatePicker } from "antd";

import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { useGlobalContext } from "../state/globalContext";

dayjs.extend(isBetween);
dayjs.extend(utc);

const { RangePicker } = DatePicker;

type TMicrotasks = RouterOutputs["projects"]["getMicroTasks"][0];
type Task = RouterOutputs["projects"]["getTasks"][0];

export default function ProjectMicroTasks({
  project_task,
}: {
  project_task: Task;
}) {
  const activeRangeDateProjectTask = project_task.project_task_dates.find(
    (v) => v.active,
  );

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
  const machines = api.machines.getMachines.useQuery();
  const [modalFechas, setModalFechas] = useState(false);
  const [selectedMicroTask, setSelectedMicroTask] =
    useState<TMicrotasks | null>(null);
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
      width: 100,
    },
    {
      title: "Descripcion",
      key: "description",
      width: 200,
      render(_, record) {
        if (!record.description) return "-";
        return record.description.length > 100 ? (
          <Popover
            content={record.description}
            title="Descripción"
            trigger="hover"
          >
            <div
              className="tw-truncate"
            >{record.description.slice(0, 100) + "..."}</div>
          </Popover>
        ) : (
          record.description
        );
      },
    },
    {
      title: "Fechas y maquinas",
      key: "dates",
      render(_, record) {
        const click = () => {
          if (!activeRangeDateProjectTask) {
            void ctx?.messageApi.error(
              "No se puede asignar fechas, porque la tarea no tiene fechas",
            );
            return;
          }
          setModalFechas(true);
          setSelectedMicroTask(record);
        };

        if (record.micro_task_dates.length === 0) {
          return (
            <Button size="small" onClick={click}>
              Asignar Fechas
            </Button>
          );
        }
        const active = record.micro_task_dates.find((d) => d.active);
        if (!active) return null;
        return (
          <Space.Compact>
            <Tooltip title="Fecha de inicio">
              <Button size="small" onClick={click}>
                {dayjs
                  .utc(active.tracking_date.start_date)
                  .format("DD/MM/YYYY")}
              </Button>
            </Tooltip>
            <Tooltip title="Fecha de fin">
              <Button size="small" onClick={click}>
                {dayjs.utc(active.tracking_date.end_date).format("DD/MM/YYYY")}
              </Button>
            </Tooltip>
          </Space.Compact>
        );
      },
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
    {
      title: "Acciones",
      key: "actions",
      render(_, record) {
        return (
          <Popconfirm
            title="¿Deseas eliminar esta micro tarea?"
            onConfirm={async () => {
              await deleteMicroTask.mutateAsync({ id: record.id });
            }}
          >
            <Button
              danger
              loading={deleteMicroTask.isPending}
              size="small"
              type="primary"
            >
              Eliminar
            </Button>
          </Popconfirm>
        );
      },
    },
  ];
  const deleteMicroTask = api.projects.deleteMicroTask.useMutation({
    onSuccess() {
      void microtasks.refetch();
      setSelectedMicroTask(null);
    },
  });
  const [createModal, setCreateModal] = useState(false);
  const form = Form.useForm<Pick<TMicrotasks, "name" | "description">>()[0];
  const createMicroTask = api.projects.createMicroTask.useMutation({
    onSuccess() {
      void microtasks.refetch();
    },
  });
  const formDatesMicroTask = Form.useForm<{
    machine: string | undefined;
    dates: [dayjs.Dayjs, dayjs.Dayjs] | undefined;
  }>()[0];
  const createMicroTaskDate = api.projects.createMicroTaskDate.useMutation({
    async onSuccess() {
      const data = await microtasks.refetch();
      if (selectedMicroTask) {
        setSelectedMicroTask(
          data.data?.find((r) => r.id === selectedMicroTask.id) ?? null,
        );
      }
      formDatesMicroTask.resetFields();
      void ctx?.messageApi.success("Fecha asignada correctamente");
      void activeMicroTaskDates.refetch();
    },
  });
  const activeMicroTaskDates = api.projects.activeMicroTaskDates.useQuery();
  const ctx = useGlobalContext();
  const onFinishMicroTaskDate = (values: {
    machine: string | undefined;
    dates: [dayjs.Dayjs, dayjs.Dayjs] | undefined;
  }) => {
    if (!selectedMicroTask) {
      void ctx?.messageApi.warning("Debe seleccionar una micro tarea");
      return;
    }
    if (values.dates?.[0] === undefined || values.dates?.[1] === undefined) {
      void ctx?.messageApi.warning("Debe seleccionar una fecha");
      return;
    }

    void createMicroTaskDate.mutateAsync({
      microtask_id: selectedMicroTask?.id,
      machine_id: values.machine,
      start_date: values.dates[0].format("YYYY-MM-DD"),
      end_date: values.dates[1].format("YYYY-MM-DD"),
    });
  };
  const selectedMachineId = Form.useWatch("machine", formDatesMicroTask);
  const columnsDates: ColumnProps<TMicrotasks["micro_task_dates"][0]>[] = [
    {
      title: "Maquina",
      key: "machine",
      render(_, record) {
        if (!record.used_machine) {
          return <Tag>N/A</Tag>;
        }
        return (
          <div>
            <Tag>{record.used_machine.name}</Tag>
            <Tag color="green">{record.used_machine.brand.name}</Tag>
          </div>
        );
      },
    },
    {
      title: "Fecha de inicio",
      dataIndex: "date",
      key: "date",
      render(_, record) {
        return (
          <Tag>
            {dayjs(record.tracking_date.start_date).format("DD/MM/YYYY")}
          </Tag>
        );
      },
    },
    {
      title: "Fecha de fin",
      dataIndex: "date",
      key: "date",
      render(_, record) {
        return (
          <Tag>{dayjs(record.tracking_date.end_date).format("DD/MM/YYYY")}</Tag>
        );
      },
    },
    {
      title: "Creado",
      dataIndex: "created_at",
      key: "created_at",
      render(_, record) {
        return <Tag>{dayjs(record.created_at).format("DD/MM/YYYY")}</Tag>;
      },
    },
    {
      title: "Estado",
      key: "state",
      render(_, record) {
        return (
          <Tag color={record.active ? "green" : "red"}>
            {record.active ? "Activo" : "Inactivo"}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="tw-bg-white tw-bg-opacity-10 tw-p-1">
      <Modal
        title={`Fechas de ${selectedMicroTask?.name}`}
        open={modalFechas}
        footer={null}
        onCancel={() => {
          setModalFechas(false);
          formDatesMicroTask.resetFields();
        }}
        width={1000}
      >
        <Card title="Asignar Fechas" size="small">
          <Form
            layout="vertical"
            form={formDatesMicroTask}
            onFinish={onFinishMicroTaskDate}
          >
            <Form.Item label="Maquina" name="machine">
              <Select
                allowClear
                style={{ width: "100%" }}
                options={machines.data?.map((m) => {
                  return { label: m.name, value: m.id };
                })}
                onChange={() => {
                  //Reset range
                  formDatesMicroTask.setFieldsValue({ dates: undefined });
                }}
              />
            </Form.Item>
            <Form.Item
              label="Fechas"
              name="dates"
              rules={[
                { required: true, message: "Por favor ingrese la fecha" },
              ]}
            >
              <RangePicker
                minDate={dayjs.utc(
                  activeRangeDateProjectTask?.tracking_date.start_date,
                )}
                maxDate={dayjs.utc(
                  activeRangeDateProjectTask?.tracking_date.end_date,
                )}
                style={{ width: "100%" }}
                cellRender={(current, info) => {
                  // Iterar para chequear si la fecha esta dentro de un mantenimiento
                  let isDateInMainteneance = false;
                  let isOccupied = false;
                  const selectedMachine = machines.data?.find(
                    (m) => m.id === selectedMachineId,
                  );
                  if (selectedMachine) {
                    isDateInMainteneance =
                      selectedMachine.machine_mainteneance.some((m) => {
                        return dayjs(current).isBetween(
                          m.start_date,
                          m.end_date,
                          "day",
                          "[]",
                        );
                      });

                    activeMicroTaskDates.data?.forEach((d) => {
                      if (d.used_machine_id === selectedMachineId) {
                        if (
                          dayjs
                            .utc(current)
                            .isBetween(
                              dayjs.utc(d.tracking_date.start_date),
                              dayjs.utc(d.tracking_date.end_date),
                              "day",
                              "[]",
                            )
                        ) {
                          isOccupied = true;
                        }
                      }
                    });
                  }
                  //Now check if its not used by another microtask

                  if (isDateInMainteneance) {
                    return (
                      <Tooltip
                        title={`Esta fecha se encuentra dentro de un mantenimiento`}
                      >
                        <span style={{ color: "red" }}>{info.originNode}</span>
                      </Tooltip>
                    );
                  }
                  if (isOccupied) {
                    return (
                      <Tooltip
                        title={`Alguien esta usando la maquina en esa fecha :(`}
                      >
                        <span style={{ color: "yellow" }}>
                          {info.originNode}
                        </span>
                      </Tooltip>
                    );
                  }

                  return info.originNode;
                }}
              />
            </Form.Item>
            <div className="tw-flex tw-justify-end">
              <Button type="primary" htmlType="submit">
                Asignar
              </Button>
            </div>
          </Form>
        </Card>
        <Card title="Fechas Asignadas">
          <Table
            size="small"
            pagination={false}
            rowKey="id"
            dataSource={selectedMicroTask?.micro_task_dates}
            columns={columnsDates}
          />
        </Card>
      </Modal>

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
