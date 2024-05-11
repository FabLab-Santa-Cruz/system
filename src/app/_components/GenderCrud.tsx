"use client";

import {
	Button,
	Divider,
	Form,
	type FormProps,
	Input,
	Table,
	Typography,
} from "antd";
import { type ColumnProps } from "antd/es/table";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { useGlobalContext } from "../state/globalContext";

type gender = RouterOutputs["person"]["listGenders"][0];
export default function GenderCrud() {
	const genders = api.person.listGenders.useQuery();
	const deleteGender = api.person.deleteGender.useMutation({
		onSuccess() {
			void genders.refetch();
		},
	});
	const upsertGender = api.person.upsertGender.useMutation({
		onMutate() {
			form.resetFields();
		},
		async onSuccess() {
			await genders.refetch();
		},
	});
	const columns: ColumnProps<gender>[] = [
		{
			title: "Genero",
			key: "gender",
			render: (_, row) => {
				return <>{row.name}</>;
			},
		},
		{
			title: "Acciones",
			key: "actions",
			width: 100,
			render: (_, row) => {
				return (
					<>
						<Button
							type="primary"
							onClick={() => {
								form.setFieldsValue({
									id: row.id,
									name: row.name,
								});
							}}
							size="small"
						>
							Editar
						</Button>
						<Button
							size="small"
							type="primary"
							danger
							onClick={() => {
								void deleteGender.mutateAsync({ id: row.id });
							}}
						>
							Eliminar
						</Button>
					</>
				);
			},
		},
	];

	const [form] = Form.useForm();
	const global = useGlobalContext();
	const onFinish: FormProps<gender>["onFinish"] = (values) => {
		if (genders.data?.find((g) => g.name === values.name)) {
			void global?.messageApi.error("El genero ya existe");
			return;
		}
		void upsertGender.mutateAsync({
			id: values.id,
			name: values.name,
		});
	};
	const id = Form.useWatch("id", form) as string | undefined;
	return (
		<>
			<Divider>
				<Typography.Text>{id ? "Actualizar" : "Crear"} genero</Typography.Text>
			</Divider>
			<Form form={form} labelCol={{ span: 4 }} onFinish={onFinish}>
				<Form.Item name="id" hidden>
					<Input />
				</Form.Item>
				<Form.Item
					name="name"
					label="Genero"
					rules={[{ required: true, message: "Por favor, ingrese un genero" }]}
				>
					<Input />
				</Form.Item>
				<div className="tw-flex">
					<Button
						className="tw-ml-auto"
						type="primary"
						htmlType="submit"
						loading={genders.isLoading}
					>
						{id ? "Actualizar" : "Crear"}
					</Button>
					{id && <Button onClick={() => form.resetFields()}>Cancelar</Button>}
				</div>
			</Form>
			<Divider>
				<Typography.Text>Listado de generos</Typography.Text>
			</Divider>
			<Table
				size="small"
				scroll={{ y: 200 }}
				pagination={false}
				key={"gender"}
				columns={columns}
				loading={genders.isLoading}
				dataSource={genders.data}
			/>
		</>
	);
}