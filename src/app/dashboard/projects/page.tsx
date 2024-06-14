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

  const [modal, setModal] = useState(false);

  const columns: ColumnProps<Projects>[] = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Creado",
      key : "createdAt",
      render: (_: unknown, project: Projects) => {
        return <>{dayjs(project.created_at).format("DD/MM/YYYY")}</>;
      },
      
    },
    {
      title: "Fechas",
      key: "date",
      render: (_: unknown, project: Projects) => {
        const lastTrackingDate = project.project_dates.find(
          (date) => date.active,
        );
        if (!lastTrackingDate) return <>No hay fechas</>;
        return (
          <>
            <Tooltip title="Fecha de inicio">
              <Tag color="blue">
                {dayjs(lastTrackingDate.tracking_date.start_date).format(
                  "DD/MM/YYYY",
                )}
              </Tag>
            </Tooltip>
            <Tooltip title="Fecha de fin">
              <Tag color="green">
                {dayjs(lastTrackingDate.tracking_date.end_date).format(
                  "DD/MM/YYYY",
                )}
              </Tag>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "Estado",
      key: "state",
      render: (_: unknown, project: Projects) => {
        return <>{project.status}</>;
      },
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
    },
    {
      title: "Trabajadores",
      key: "workers",
      render: (_: unknown, project: Projects) => {
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
            <Button
              size="small"
              type="primary"
              onClick={() => {
                //setSelectedProject(project);
                formVolunteers.setFieldValue(
                  "volunteers",
                  project.workers.map((v) => v.id),
                );
                setModal(true);
              }}
            >
              Ver
            </Button>
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
  const onFinishFormVolunteers = async (values: { volunteers: string[] }) => {
    if (selectedProject === null) {
      void global?.messageApi.warning("Debe seleccionar un proyecto");
      return;
    }
    await assignVolunteers.mutateAsync({
      id: selectedProject?.id,
      volunteers: values.volunteers,
    });

    setModal(false);
  };
  const assignVolunteers = api.projects.assignVolunteers.useMutation({
    onSuccess: () => {
      formVolunteers.resetFields();
      void projects.refetch();
    },
    onError: (e) => {
      console.log(e.message, "message");
    },
  });

  return (
    <div className="tw-px-10 tw-pt-4">
      <Modal
        title="Voluntarios a asignar a proyecto"
        open={modal}
        onCancel={() => {
          setModal(false);
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
              options={volunteers.data?.map((volunteer) => {
                return {
                  label: volunteer.user.email,
                  value: volunteer.id,
                };
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div className="tw-flex tw-w-full tw-gap-2">
        <div className="tw-basis-2/3">
          <Card title="Proyectos">
            <div className="tw-flex">
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
              onRow={(record) => {
                return {
                  onClick: () => {
                    setSelectedProject(record);
                  },
                };
              }}
              columns={columns}
              dataSource={projects.data}
            />
          </Card>
        </div>
        <div className="tw-basis-1/3">
          <Card
            title={
              selectedProject
                ? `Fechas del proyecto: ${selectedProject.name}`
                : "Fechas de proyecto"
            }
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
          </Card>
        </div>
      </div>
      <div className="tw-pt-2">
        <div>
          {selectedProject && (
            // <TasksList project={selectedProject} />
            <ProjectTasks project_id={selectedProject.id} />
          )}
        </div>
      </div>
    </div>
  );
}




