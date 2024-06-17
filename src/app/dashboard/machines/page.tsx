"use client";

import {
  Button,
  type CalendarProps,
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
  Tooltip,
} from "antd";
import { api } from "~/trpc/react";

import { type RouterOutputs } from "~/server/api/root";
import { type ColumnProps } from "antd/es/table";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import {
  type BasicUpload,
  UploadWithCrop,
} from "~/app/_components/UploadWithCrop";
import { env } from "~/env";
import { WithUrl } from "~/utils/withUrl";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { useGlobalContext } from "~/app/state/globalContext";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import SimpleUpload from "~/app/_components/SimpleUpload";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
type TMachine = RouterOutputs["machines"]["getMachines"][0];

export default function MachinesPage() {
  const machines = api.machines.getMachines.useQuery();
  const deleteMachine = api.machines.deleteMachine.useMutation({
    async onSuccess() {
      await machines.refetch();
    },
  });
  const [modalFiles, setModalFiles] = useState(false);
  const [modalMantenimiento, setModalMantenimiento] = useState(false);
  const columns: ColumnProps<TMachine>[] = [
    {
      title: "Imagen",
      key: "image",
      render: (_, row) => {
        return (
          <Image
            src={WithUrl(row.image) ?? env.NEXT_PUBLIC_DEFAULT_NO_IMAGE}
            alt="image"
            width={50}
            height={50}
          />
        );
      },
    },
    {
      title: "Marca",

      key: "brand",
      render(_, record) {
        return <Tag>{record.brand.name}</Tag>;
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
      title: "Estado",
      key: "state",
      render: (_, row) => {
        const stateMap: Record<TMachine["status"], string> = {
          USABLE: "Disponible",
          IN_REPAIR: "En reparación",
        };

        return (
          <Select
            defaultValue={row.status}
            options={Object.keys(stateMap).map((key) => ({
              value: key,
              label: stateMap[key as TMachine["status"]],
            }))}
            style={{ width: "100%" }}
          />
        );
      },
    },
    {
      title: "Creador",
      key: "creator",
      render: (_, row) => {
        return <Tag>{row.created_by.user.email}</Tag>;
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, row) => {
        return (
          <Space.Compact>
            <Button
              size="small"
              onClick={() => {
                setSelectedMachine(row);
                setModalFiles(true);
              }}
              type="dashed"
            >
              Archivos
            </Button>
            <Button
              size="small"
              onClick={() => {
                setSelectedMachine(row);
                setModalMantenimiento(true);
              }}
              type="dashed"
            >
              Mantenimientos
            </Button>
            <Button
              size="small"
              onClick={() => {
                form.setFieldsValue({
                  id: row.id,
                  brand_id: row.brand.id,
                  name: row.name,
                  description: row.description,
                  image: row.image ? [{ key: row.image }] : [],
                });
                setSelectedMachine(row);
                setCreateModal(true);
              }}
              type="primary"
            >
              Editar
            </Button>
            <Popconfirm
              onConfirm={() => {
                deleteMachine.mutate({ id: row.id });
              }}
              title="¿Deseas eliminar esta maquina?"
            >
              <Button size="small" type="primary" danger>
                Eliminar
              </Button>
            </Popconfirm>
          </Space.Compact>
        );
      },
    },
  ];
  const [selectedMachine, setSelectedMachine] = useState<TMachine | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const form = Form.useForm<
    Pick<TMachine, "id" | "name" | "description" | "brand_id"> & {
      image: BasicUpload[];
    }
  >()[0];
  const upsertMachine = api.machines.upsertMachine.useMutation({
    onSuccess: () => {
      setCreateModal(false);
      form.resetFields();
      void machines.refetch();
    },
  });

  const brands = api.brand.list.useQuery();

  const onFinish = (
    values: Pick<TMachine, "id" | "name" | "description" | "brand_id"> & {
      image: BasicUpload[] | undefined;
    },
  ) => {
    console.log(values.image);
    void upsertMachine.mutateAsync({
      id: values.id,
      brandId: values.brand_id,
      name: values.name,
      description: values.description,
      image: values.image?.at(0)?.key ?? null,
    });
  };
  const context = useGlobalContext();
  const formMaintenance = Form.useForm()[0];
  const deleteMaintenance = api.machines.deleteMaintenance.useMutation({
    async onSuccess() {
      const data = await machines.refetch();
      if (data) {
        setSelectedMachine(
          data.data?.find((machine) => machine.id === selectedMachine?.id) ??
            null,
        );
        void context?.messageApi.success("Mantenimiento eliminado");
      }
    },
  });
  const columnsMaintenances: ColumnProps<
    TMachine["machine_mainteneance"][0]
  >[] = [
    {
      title: "Fechas",
      key: "dates",
      render: (_, row) => {
        return (
          <Space.Compact>
            <Tooltip title={"Fecha de inicio"}>
              <Button size="small">
                {dayjs.utc(row.start_date).format("DD/MM/YYYY")}
              </Button>
            </Tooltip>
            <Tooltip title={"Fecha de fin"}>
              <Button size="small">
                {dayjs.utc(row.end_date).format("DD/MM/YYYY")}
              </Button>
            </Tooltip>
          </Space.Compact>
        );
      },
    },
    {
      title: "Descripcion",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Creador",
      key: "creator",
      render: (_, row) => {
        return <Tag>{row.created_by.user.email}</Tag>;
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, row) => {
        return (
          <Button
            danger
            size="small"
            onClick={() => {
              void deleteMaintenance.mutateAsync({ id: row.id });
            }}
            type="primary"
            loading={deleteMaintenance.isPending}
          >
            Eliminar
          </Button>
        );
      },
    },
  ];
  const global = useGlobalContext();

  const createMainteneance = api.machines.createMainteneance.useMutation({
    onSuccess: async () => {
      void global?.messageApi.success("Mantenimiento creado");
      void formMaintenance.resetFields();
      const data = await machines.refetch();
      if (selectedMachine) {
        setSelectedMachine(
          data.data?.find((machine) => machine.id === selectedMachine.id) ??
            null,
        );
      }
    },
  });
  const onFinishMaintenance = (values: {
    range: [Dayjs, Dayjs];
    description: string;
  }) => {
    if (!values.range[0] || !values.range[1]) {
      void global?.messageApi.error("Por favor, ingrese las fechas");
      return;
    }
    // Chequeamos que no haya un mantenimiento sobre esos rangos
    if (
      selectedMachine?.machine_mainteneance.some(
        (maintenance) =>
          values.range[0].isSameOrBefore(maintenance.end_date) &&
          values.range[1].isSameOrAfter(maintenance.start_date),
      )
    ) {
      void global?.messageApi.error(
        "Ya existe un mantenimiento sobre ese rango de fechas",
      );
      return;
    }

    createMainteneance.mutate({
      machineId: selectedMachine?.id ?? "",
      start_date: values.range[0].format("YYYY-MM-DD"),
      end_date: values.range[1].format("YYYY-MM-DD"),
      description: values.description,
    });
  };
  const addFiles = api.machines.addFiles.useMutation({
    onSuccess: async () => {
      void global?.messageApi.success("Archivos agregados");
      void formMaintenance.resetFields();
      const data = await machines.refetch();
      if (selectedMachine) {
        setSelectedMachine(
          data.data?.find((machine) => machine.id === selectedMachine.id) ??
            null,
        );
      }
    },
  });
  const activeMicroTaskDates = api.projects.activeMicroTaskDates.useQuery();
  return (
    <div className="tw-w-full tw-px-10 tw-pt-2">
      <Modal
        open={modalFiles}
        onCancel={() => setModalFiles(false)}
        footer={null}
        title="Archivos"
        width={800}
      >
        <Card size="small" title="Archivos">
          {selectedMachine?.files.map((file) => {
            const name = file.key.split("/").pop();
            return (
              <Button key={file.key}>
                <a href={WithUrl(file.key)!}>{name}</a>
              </Button>
            );
          })}
        </Card>

        <SimpleUpload
          maxSizeMB={300}
          onFinish={(value) => {
            if (!selectedMachine) return;
            void addFiles.mutateAsync({
              files: [{ url: value }],
              machineId: selectedMachine.id,
            });
          }}
        />
      </Modal>
      <Modal
        open={modalMantenimiento}
        onCancel={() => setModalMantenimiento(false)}
        footer={null}
        title="Mantenimientos"
        width={800}
      >
        <Card
          size="small"
          title={`Crear mantenimiento para ${selectedMachine?.name}`}
        >
          <Form
            form={formMaintenance}
            layout="vertical"
            onFinish={onFinishMaintenance}
          >
            <Form.Item
              name="range"
              label="Fecha de inicio"
              rules={[
                { required: true, message: "Por favor ingrese las fechas" },
              ]}
            >
              <RangePicker
                cellRender={(current, info) => {
                  // Iterar para chequear si la fecha esta dentro de un mantenimiento
                  let isDateInMainteneance = false;
                  let isOccupied = false;
                  selectedMachine?.machine_mainteneance.forEach(
                    (maintenance) => {
                      const start = dayjs.utc(maintenance.start_date);
                      const end = dayjs.utc(maintenance.end_date).endOf("day");
                      const currentDate = dayjs(current);
                      if (currentDate.isBetween(start, end, null, "[]")) {
                        isDateInMainteneance = true;
                      }
                    },
                  );
                  activeMicroTaskDates.data?.forEach((d) => {
                    if (d.used_machine_id === selectedMachine?.id) {
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

                  if (isDateInMainteneance) {
                    return (
                      <Tooltip
                        title={`Esta fecha se encuentra dentro de un mantenimiento`}
                      >
                        <span style={{ color: "red" }}>{info.originNode}</span>
                      </Tooltip>
                    );
                  }
                  if(isOccupied) {
                    return (
                      <Tooltip
                        title={`Esta fecha se encuentra dentro de una tarea`}
                      >
                        <span style={{ color: "yellow" }}>{info.originNode}</span>
                      </Tooltip>
                    );
                  }
                  return info.originNode;
                }}
              />
            </Form.Item>
            <Form.Item name="description" label="Descripción">
              <Input.TextArea />
            </Form.Item>
            <div>
              <Button type="primary" htmlType="submit">
                Crear
              </Button>
            </div>
          </Form>
        </Card>
        <Card size="small" title={`Mantenimientos de ${selectedMachine?.name}`}>
          <Table
            rowKey="id"
            dataSource={selectedMachine?.machine_mainteneance}
            columns={columnsMaintenances}
            pagination={false}
            size="small"
          />
        </Card>
      </Modal>
      <Modal
        open={createModal}
        onCancel={() => setCreateModal(false)}
        onOk={() => form.submit()}
        title={`${selectedMachine ? "Editar" : "Crear"} Maquina`}
        width={500}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "Por favor ingrese el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="brand_id"
            label="Marca"
            rules={[{ required: true, message: "Por favor ingrese la marca" }]}
          >
            <Select
              options={brands.data?.map((brand) => ({
                value: brand.id,
                label: brand.name,
              }))}
            />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <TextArea />
          </Form.Item>

          <Form.Item label="Imagen" name="image">
            <UploadWithCrop maxFiles={1} isPublic={true} />
          </Form.Item>
        </Form>
      </Modal>
      <Card title="Maquinas" size="small">
        <Button
          onClick={() => {
            setCreateModal(true);
            setSelectedMachine(null);
            form.resetFields();
          }}
          type="primary"
        >
          Crear Maquina
        </Button>
        <Table
          size="small"
          rowKey="id"
          loading={machines.isLoading}
          columns={columns}
          dataSource={machines.data}
        />
      </Card>
    </div>
  );
}
