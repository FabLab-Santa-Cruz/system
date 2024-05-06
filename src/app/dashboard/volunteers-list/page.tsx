"use client";
import { Button, Form, Input, Modal, Table, Typography } from "antd";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";

import { useState } from "react";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";

type Volunteer = RouterOutputs["volunteer"]["list"][0];
//=>
export default function List() {
	const lista = api.volunteer.list.useQuery();
	const [selected, setSelected] = useState<Volunteer | null>(null);
	const columns: ColumnProps<Volunteer>[] = [
		{
			title: "Avatar",
			key: "avatar",
			render(_, row) {
				return <>{row.person?.name}</>;
			},
		},
		{
			title: "Nombre",
			key: "name",
			render(_, row) {
				return <>{row.person?.name}</>;
			},
		},
		{
			title: "Habilidades",
			key: "skills",
			render(_, row) {
				return (
					<Typography.Text>{`${row.person?.f_lastname ?? ""} ${
						row.person?.m_lastname ?? ""
					}`}</Typography.Text>
				);
			},
		},
		{
			title: "Procedencia",
			key: "procedence",
			render(_, row) {
				return (
					<Typography.Text>
						{row.person?.emails?.map((e) => e.mail).join(", ")}
					</Typography.Text>
				);
			},
		},
		{
			title: "Projectos",
			key: "phones",
			render(_, row) {
				return (
					<Typography.Text>
						{row.person?.phones?.map((p) => p.phone).join(", ")}
					</Typography.Text>
				);
			},
		},
		{
			title: "Procedencia(s)",
			key: "procedence",
			render(_, row) {
				return <>{row.procedence.map((v) => v.name).join(", ")}</>;
			},
		},
		{
			title: "Asistencia",
			key: "procedence",
			render(_, row) {
				return <>{row.procedence.map((v) => v.name).join(", ")}</>;
			},
		},

		{
			title: "Creado",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (_: unknown, volunteer: Volunteer) => {
				return (
					<Typography.Text>
						{dayjs(volunteer.created_at).format("DD/MM/YYYY")}
					</Typography.Text>
				);
			},
		},
		{
			title: "Acciones",
			key: "actions",
			render: (_: unknown, volunteer: Volunteer) => {
				return (
					<div>
						<Button
							onClick={() => {
								setSelected(volunteer);
								setModal(true);
							}}
						>
							Editar
						</Button>
					</div>
				);
			},
		},
	];
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
			<Table
				loading={lista.isLoading}
				dataSource={lista.data}
				columns={columns}
			/>
		</div>
	);
}
