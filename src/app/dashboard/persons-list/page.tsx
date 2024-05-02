"use client";
import {
	Button,
	DatePicker,
	Form,
	Input,
	Modal,
	Select,
	Table,
	Tag,
	Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";

import { useState } from "react";
import { UploadWithCrop } from "~/app/_components/UploadWithCrop";
import { RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";

type Person = RouterOutputs["person"]["list"][0];

//=>
export default function PersonList() {
	const lista = api.person.list.useQuery();
	const genders = api.person.listGenders.useQuery();
	const [selected, setSelected] = useState<Person | null>(null);
	const columns: ColumnProps<Person>[] = [
		{
			title: "Imagenes",
			render(_, row) {
				return (
					<Typography.Text>
						{row.images?.map((i) => i.key).join(", ")}
					</Typography.Text>
				);
			},
		},

		{
			title: "Nombre",
			key: "name",
			render(_, row) {
				return <>{row.name}</>;
			},
		},
		{
			title: "Apellido(s)",
			key: "lastname",
			render(_, row) {
				return (
					<Typography.Text>{`${row.f_lastname ?? ""} ${
						row.m_lastname ?? ""
					}`}</Typography.Text>
				);
			},
		},
		{
			title: "Email(s)",
			key: "emails",
			render(_, row) {
				return (
					<Typography.Text>
						{row.emails?.map((e) => e.mail).join(", ")}
					</Typography.Text>
				);
			},
		},
		{
			title: "Telefono(s)",
			key: "phones",
			render(_, row) {
				return (
					<Typography.Text>
						{row.phones?.map((p) => p.phone).join(", ")}
					</Typography.Text>
				);
			},
		},
		{
			title: "Genero",
			key: "gender",
			render(_, row) {
				return <>{row.gender?.name}</>;
			},
		},
		{
			title: "Fecha de nacimiento",
			key: "birthdate",
			render(_, row) {
				return <>{dayjs(row.birthdate ?? "").format("DD/MM/YYYY")}</>;
			},
		},
		{
			title: "Creado",
			key: "createdAt",
			render: (_: unknown, person) => {
				return (
					<Typography.Text>
						{dayjs(person.created_at).format("DD/MM/YYYY")}
					</Typography.Text>
				);
			},
		},
		{
			title: "Acciones",
			key: "actions",
			render: (_: unknown, person) => {
				return (
					<div>
						<Button
							onClick={() => {
								setSelected(person);
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
	const [form] = useForm();
	const emails = Form.useWatch("emails", form);
	const phones = Form.useWatch("phones", form);
	const onFinish = (values: unknown) => {
		console.log(values);
	};
	return (
		<div className="tw-m-4 ">
			<Modal
				title={`${selected ? "Editar" : "Crear"} Persona`}
				open={modal}
				onOk={() => setModal(false)}
				onCancel={() => setModal(false)}
				width={800}
				footer={null}
			>
				<Form form={form} labelWrap labelCol={{ span: 6 }} onFinish={onFinish}>
					<Form.Item
						name="name"
						label="Nombre"
						rules={[
							{ required: true, message: "Por favor, ingrese un nombre" },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item name="f_lastname" label="Apellido paterno">
						<Input />
					</Form.Item>
					<Form.Item name="m_lastname" label="Apellido materno">
						<Input />
					</Form.Item>
					<Form.Item name="ci" label="Cedula o pasaporte">
						<Input />
					</Form.Item>
					<Form.Item name="gender_id" label="Genero">
						<Select
							options={genders.data?.map((g) => ({
								value: g.id,
								label: g.name,
							}))}
						/>
					</Form.Item>
					<div className="tw-ml-[25%]">
						Separado por comas:{" "}
						{typeof emails === "string" &&
							emails.trim() !== "" &&
							emails?.split(",").map((v: string) => (
								<Tag>
									<Typography.Text>{` ${v.trim()} `}</Typography.Text>
								</Tag>
							))}
					</div>
					<Form.Item name="emails" label={"Emails"}>
						<Input />
					</Form.Item>
					{/* Lo mismo pero con telefonos */}
					<div className="tw-ml-[25%]">
						Separado por comas:{" "}
						{typeof phones === "string" &&
							phones.trim() !== "" &&
							phones?.split(",").map((v: string) => (
								<Tag>
									<Typography.Text>{` ${v.trim()} `}</Typography.Text>
								</Tag>
							))}
					</div>
					<Form.Item name="phones" label={"Telefonos"}>
						<Input />
					</Form.Item>
					<Form.Item name="birthdate" label="Fecha de nacimiento">
						<DatePicker
							defaultValue={dayjs().subtract(18, "year")}
							className="tw-w-full"
						/>
					</Form.Item>
					<Form.Item name={"images"} label={"Imagenes"}>
						<UploadWithCrop isPublic maxFiles={Infinity} />
					</Form.Item>
					<div className="tw-flex">
						<Button type="primary" className="tw-ml-auto" htmlType="submit">
							{selected ? "Editar" : "Crear"}
						</Button>
					</div>
				</Form>
			</Modal>
			<div className="tw-flex">
				<Button
					onClick={() => {
						setModal(true);
						setSelected(null);
					}}
					className="tw-ml-auto"
					type="primary"
				>
					Crear Persona
				</Button>
			</div>
			<Table
				loading={lista.isLoading}
				dataSource={lista.data}
				columns={columns}
			/>
		</div>
	);
}
