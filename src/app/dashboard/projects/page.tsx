"use client";

import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";
import DatesComponent from "~/app/_components/DatesComponent";
import ProjectTasks from "~/app/_components/ProjectTasks";
import { useGlobalContext } from "~/app/state/globalContext";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";

type Projects = RouterOutputs["projects"]["myProjects"][0];

type TProjectStatus = Projects["status"];

export default function Projects() {
  const [searchParamsProjects, setSearchParamsProjects] = useState({
    deleted: true,
  });
  const createProjectDate = api.projects.createProjectDate.useMutation({
    onSuccess: async () => {
      const newData = await projects.refetch();
      if (selectedProject) {
        setSelectedProject(
          newData.data?.find((p) => p.id === selectedProject?.id) ?? null,
        );
      }
      void global?.messageApi.success("Fecha agregada");
      formCreateProjectDate.resetFields();
    },
  });
  const volunteers = api.volunteer.list.useQuery();

  const projects = api.projects.myProjects.useQuery(searchParamsProjects);
  const deleteProject = api.projects.deleteProject.useMutation({
    onSuccess: () => {
      void projects.refetch();
    },
  });
  const restoreProject = api.projects.restoreProject.useMutation({
    onSuccess: () => {
      void projects.refetch();
    },
  });
  const updateProjectStatus = api.projects.updateProjectStatus.useMutation({
    onSuccess: () => {
      void projects.refetch();
    },
  });

  const columns: ColumnProps<Projects>[] = [
    {
      title: "Creado",
      key: "createdAt",
      render: (_: unknown, project: Projects) => {
        return (
          <Tag>{dayjs(project.created_at).format("DD/MM/YYYY HH:mm")}</Tag>
        );
      },
      width: 100,
    },
    {
      title: "Dueño",
      key: "owner",
      render: (_: unknown, project: Projects) => {
        return (
          <>
            <Tag color="gold">{project.creator?.user.email}</Tag>
            <Tag>{`${project.creator?.user.person.name ?? ""} `}</Tag>
          </>
        );
      },
      width: 100,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Fechas",
      key: "date",
      render: (_: unknown, project: Projects) => {
        const lastTrackingDate = project.project_dates.find(
          (date) => date.active,
        );
        const click = () => {
          setSelectedProject(project);
          setModalFechas(true);
        };
        if (!lastTrackingDate)
          return (
            <Button size="small" onClick={click}>
              No hay fechas
            </Button>
          );
        return (
          <>
            <Space.Compact>
              <Tooltip title="Fecha de inicio">
                <Button size="small" onClick={click}>
                  {dayjs(lastTrackingDate.tracking_date.start_date).format(
                    "DD/MM/YYYY",
                  )}
                </Button>
              </Tooltip>

              <Tooltip title="Fecha de fin">
                <Button size="small" onClick={click}>
                  {dayjs(lastTrackingDate.tracking_date.end_date).format(
                    "DD/MM/YYYY",
                  )}
                </Button>
              </Tooltip>
            </Space.Compact>
          </>
        );
      },
    },
    {
      title: "Estado",
      key: "status",
      filters: [
        {
          text: "En progreso",
          value: "IN_PROGRESS",
        },
        {
          text: "Completado",
          value: "COMPLETED",
        },
        {
          text: "Cancelado",
          value: "CANCELED",
        },
      ],
      onFilter: (value, record: Projects) => {
        return record.status === value;
      },
      render: (_: unknown, project: Projects) => {
        const mapStatus: Record<TProjectStatus, string> = {
          IN_PROGRESS: "En progreso",
          COMPLETED: "Completado",
          CANCELED: "Cancelado",
        };
        return (
          <Select
            loading={updateProjectStatus.isPending}
            size="small"
            defaultValue={project.status}
            options={Object.entries(mapStatus).map(([key, value]) => {
              return {
                label: value,
                value: key,
              };
            })}
            onChange={(value) => {
              updateProjectStatus.mutate({ id: project.id, status: value });
            }}
          />
        );
      },
    },

    {
      title: "Trabajadores",
      key: "workers",
      render: (_: unknown, project: Projects) => {
        return (
          <Select
            size="small"
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Selecciona voluntarios"
            optionLabelProp="label"
            options={volunteers.data?.map((volunteer) => {
              return {
                label: volunteer.user.email,
                value: volunteer.id,
              };
            })}
            defaultValue={project.workers.map((v) => v.id)}
            loading={volunteers.isLoading || assignVolunteers.isPending}
            onChange={async (value) => {
              await assignVolunteers.mutateAsync({
                id: project.id,
                volunteers: value,
              });
            }}
          />
        );

        return project.workers.map((worker) => {
          return (
            <Tag key={worker.id} color="green">
              {worker.user.person.name}
            </Tag>
          );
        });
      },
    },
    {
      title: "Acciones",
      key: "action",
      render: (_: unknown, project: Projects) => {
        return (
          <Space.Compact>
            {project.deleted_at ? (
              <Popconfirm
                title="¿Desea recuperar este proyecto?"
                onConfirm={() => {
                  void restoreProject.mutateAsync({ id: project.id });
                }}
              >
                <Button size="small">Recuperar</Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="¿Desea eliminar este proyecto?"
                onConfirm={() => {
                  void deleteProject.mutate({ id: project.id });
                }}
              >
                <Button size="small" type="primary" danger>
                  Eliminar
                </Button>
              </Popconfirm>
            )}
          </Space.Compact>
        );
      },
    },
  ];

  const [selectedProject, setSelectedProject] = React.useState<Projects | null>(
    null,
  );

  const formCreateProject = Form.useForm<{
    name: string;
  }>()[0];
  const createProject = api.projects.createProject.useMutation({
    onSuccess: () => {
      formCreateProject.resetFields();
      void projects.refetch();
    },
    onError: (e) => {
      console.log(e.message, "message");
    },
  });
  const global = useGlobalContext();
  const onFinishCreateProject = async (values: { name: string }) => {
    if (!values.name) {
      void global?.messageApi.warning("El nombre del proyecto es obligatorio");
      return;
    }
    await createProject.mutateAsync({
      name: values.name,
    });
  };
  const formCreateProjectDate = Form.useForm<{
    start_date: dayjs.Dayjs | undefined;
    end_date: dayjs.Dayjs | undefined;
  }>()[0];

  const utils = api.useUtils();
  const onFinishCreateProjectDate = async (values: {
    start_date: dayjs.Dayjs | undefined;
    end_date: dayjs.Dayjs | undefined;
  }) => {
    if (selectedProject === null) {
      void global?.messageApi.warning("Debe seleccionar un proyecto");
      return;
    }
    if (!values.start_date || !values.end_date) {
      void global?.messageApi.warning("Las fechas son obligatorias");
      return;
    }

    await createProjectDate.mutateAsync({
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
      id: selectedProject?.id,
    });
    await utils.projects.getTasks.invalidate();
  };
  const [formVolunteers] = Form.useForm();

  const assignVolunteers = api.projects.assignVolunteers.useMutation({
    onSuccess: () => {
      formVolunteers.resetFields();
      void projects.refetch();
    },
    onError: (e) => {
      console.log(e.message, "message");
    },
  });
  const [modalFechas, setModalFechas] = useState(false);
  return (
    <div className="tw-w-full tw-px-10 tw-pt-4">
      <Modal
        title="Asignar fechas"
        open={modalFechas}
        onCancel={() => {
          setModalFechas(false);
        }}
        footer={null}
      >
        {selectedProject ? (
          <DatesComponent
            projectDates={selectedProject.project_dates}
            onFinish={onFinishCreateProjectDate}
          />
        ) : (
          <div>
            <p>No hay proyecto seleccionado</p>
          </div>
        )}
      </Modal>

      <div className="tw-flex tw-w-full tw-gap-2 ">
        <Card title="Proyectos" size="small" className="tw-w-full">
          <div className="tw-flex tw-w-full">
            <Form form={formCreateProject} onFinish={onFinishCreateProject}>
              <Space.Compact style={{ width: "100%" }}>
                <Form.Item noStyle name="name">
                  <Input placeholder="Mi primer proyecto..." />
                </Form.Item>
                <Button
                  loading={createProject.isPending}
                  disabled={createProject.isPending}
                  htmlType="submit"
                  type="primary"
                >
                  Crear Proyecto
                </Button>
              </Space.Compact>
            </Form>
          </div>
          <Space>
            <Input placeholder="Buscar... TODO" />
            <Switch
              value={searchParamsProjects.deleted}
              onChange={(value) => {
                setSearchParamsProjects({
                  ...searchParamsProjects,
                  deleted: value,
                });
              }}
              checkedChildren="Activos"
              unCheckedChildren="Eliminados"
            />
          </Space>
          <Table
            loading={projects.isLoading}
            rowKey={"id"}
            size="small"
            expandable={{
              expandedRowRender: (project) => {
                return <ProjectTasks project={project} />
              },
            }}
            pagination={{
              defaultCurrent: 1,
              defaultPageSize: 10,
              total: projects.data?.length,
              showTotal: (total) => `Total ${total} proyectos`,
            }}
            columns={columns}
            dataSource={projects.data}
          />
        </Card>
      </div>
    </div>
  );
}
