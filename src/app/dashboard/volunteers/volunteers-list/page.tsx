"use client";
import { Form, Input, Modal, Table } from "antd";

import { useState } from "react";

//type Volunteer = RouterOutputs["volunteer"]["list"][0];

export default function List() {
  // const lista = api.volunteer.list.useQuery();
  // const columns: ColumnProps<Volunteer>[] = [
  //   {
  //     title: "Nombre",
  //     dataIndex: "name",
  //     key: "name",
  //   },
  //   {
  //     title: "Apellido",
  //     dataIndex: "lastname",
  //   },
  //   {
  //     title: "Emails",
  //     key: "emails",
  //   },
  //   {
  //     title: "Telefonos",
  //     dataIndex: "phones",
  //     key: "phones",
  //   },
  //   {
  //     title: "Procedencia",
  //     dataIndex: "procedence",
  //     key: "procedence",
  //     // render: (_: unknown, volunteer: Volunteer) => {
  //     //   return (
  //     //     <Typography.Text>
  //     //       {volunteer.procedence.map((p) => p.name).join(", ")}
  //     //     </Typography.Text>
  //     //   );
  //     // },
  //   },
  //   {
  //     title: "Fecha de nacimiento",
  //     dataIndex: "birthdate",
  //     key: "birthdate",
  //   },
  //   {
  //     title: "Creado",
  //     dataIndex: "createdAt",
  //     key: "createdAt",
  //     render: (_: unknown, volunteer: Volunteer) => {
  //       return (
  //         <Typography.Text>
  //           {dayjs(volunteer.createdAt).format("DD/MM/YYYY")}
  //         </Typography.Text>
  //       );
  //     },
  //   },
  //   {
  //     title: "Acciones",
  //     key: "actions",
  //     render: (_: unknown, volunteer: Volunteer) => {
  //       return (
  //         <div>
  //           <Button
  //             onClick={() => {
  //               setSelected(volunteer);
  //               setModal(true);
  //             }}
  //           >
  //             Editar
  //           </Button>
  //         </div>
  //       );
  //     },
  //   },
  // ];
  const [modal, setModal] = useState(false);
  //const [selected, setSelected] = useState<Volunteer>();
  return (
    <div className="tw-m-4">
      <Modal
        //title={`${selected ? "Editar" : "Crear"} voluntario`}
        open={modal}
        onOk={() => setModal(false)}
        onCancel={() => setModal(false)}
      >
        <Form>
          <Form.Item name="name" label="Nombre">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* <Table
        loading={lista.isLoading}
        dataSource={lista.data}
        columns={columns}
      /> */}
    </div>
  );
}
