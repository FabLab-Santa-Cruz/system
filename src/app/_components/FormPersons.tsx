"use client";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { api } from "~/trpc/react";
import { UploadWithCrop } from "./UploadWithCrop";
import dayjs, { type Dayjs } from "dayjs";
import { type RouterOutputs } from "~/server/api/root";

import MultipleInput, { type BasicMultiInput } from "./MultipleInput";
export interface FormPersonOutput {
	name: string;
	f_lastname?: string;
	m_lastname?: string;
	ci?: string;
	gender_id: string;
	emails: BasicMultiInput[];
	phones: BasicMultiInput[];
	birthdate?: Dayjs | null;
	images: Image[];
}

interface Image {
	id: string;
	key: string;
}

type Person = RouterOutputs["person"]["list"][0];

export default function FormPersons({
	onFinish,
	person,
}: {
	onFinish: (e: FormPersonOutput) => void;
	person?: Partial<Person> | null;
}) {
	const [form] = Form.useForm();
	const genders = api.person.listGenders.useQuery();
	return (
		<Form
			form={form}
			labelWrap
			labelCol={{ span: 6 }}
			onFinish={onFinish}
			initialValues={{
				name: person?.name,
				f_lastname: person?.f_lastname,
				m_lastname: person?.m_lastname,
				ci: person?.ci,
				gender_id: person?.gender_id,
				emails: person?.emails?.map((e) => ({
					id: e.id,
					property: e.mail,
					deleteable: e.deleteable,
				})),
				phones: person?.phones?.map((p) => ({
					id: p.id,
					property: p.phone,
				})),
				birthdate: person?.birthdate ? dayjs(person.birthdate) : undefined,
				images: person?.images?.map((image) => ({
					id: image.id,
					key: image.key,
				})),
			}}
		>
			<Form.Item
				name="name"
				label="Nombre"
				rules={[{ required: true, message: "Por favor, ingrese un nombre" }]}
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
			<Form.Item
				name="gender_id"
				label="Genero"
				rules={[{ required: true, message: "Por favor, ingrese un genero" }]}
			>
				<Select
					options={genders.data?.map((g) => ({
						value: g.id,
						label: g.name,
					}))}
				/>
			</Form.Item>
			<Form.Item name="emails" label={"Emails"}>
				<MultipleInput formName="emails" propertyTitle="Email" />
			</Form.Item>

			<Form.Item name="phones" label={"Telefonos"}>
				<MultipleInput formName="phones" propertyTitle="Telefono" />
			</Form.Item>
			<Form.Item name="birthdate" label="Fecha de nacimiento">
				<DatePicker className="tw-w-full" />
			</Form.Item>
			<Form.Item name={"images"} label={"Imagenes"}>
				<UploadWithCrop isPublic maxFiles={100} />
			</Form.Item>
			<div className="tw-flex">
				<Button type="primary" className="tw-ml-auto" htmlType="submit">
					{person ? "Editar" : "Crear"}
				</Button>
			</div>
		</Form>
	);
}
