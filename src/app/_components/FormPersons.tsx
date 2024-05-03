"use client";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { api } from "~/trpc/react";
import { UploadWithCrop } from "./UploadWithCrop";
import dayjs, { Dayjs } from "dayjs";
import { RouterOutputs } from "~/server/api/root";
import { useEffect } from "react";

import MultipleInput from "./MultipleInput";
export interface FormPersonOutput {
	name: string;
	f_lastname?: string;
	m_lastname?: string;
	ci?: string;
	gender_id: string;
	emails: MultiInput[];
	phones: MultiInput[];
	birthdate?: Dayjs | null;
	images: Image[];
}

interface Image {
	id: string;
	key: string;
}

interface MultiInput {
	id?: string;
	property: string;
}
type Person = RouterOutputs["person"]["list"][0];

export default function FormPersons({
	onFinish,
	person,
}: {
	onFinish: (e: FormPersonOutput) => void;
	person?: Person | null;
}) {
	const [form] = Form.useForm();
	useEffect(() => {
		if (person) {
			form.setFieldsValue({
				name: person.name,
				f_lastname: person.f_lastname,
				m_lastname: person.m_lastname,
				ci: person.ci,
				gender_id: person.gender_id,
				emails: person.emails.map((e) => ({
					id: e.id,
					property: e.mail,
				})),
				phones: person.phones.map((p) => ({
					id: p.id,
					property: p.phone,
				})),
				birthdate: person.birthdate ? dayjs(person.birthdate) : undefined,
				images: person.images.map((image) => ({
					id: image.id,
					key: image.key,
				})),
			});
		}
	}, [person]);

	const genders = api.person.listGenders.useQuery();
	const imagenes = Form.useWatch("images", form);
	useEffect(() => {
		console.log(imagenes, "status");
	}, [imagenes]);
	return (
		<Form form={form} labelWrap labelCol={{ span: 6 }} onFinish={onFinish}>
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
			<Form.Item
				name="birthdate"
				label="Fecha de nacimiento"
				initialValue={dayjs().subtract(18, "year")}
			>
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