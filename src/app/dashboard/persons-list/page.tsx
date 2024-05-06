"use client";
import {
	Button,
	Image as AntImage,
	Modal,
	Table,
	Typography,
	Tag,
	Popconfirm,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";

import { useState } from "react";
import FormPersons, {
	type FormPersonOutput,
} from "~/app/_components/FormPersons";
import GenderCrud from "~/app/_components/GenderCrud";
import { useGlobalContext } from "~/app/globalContext";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import Image from "next/image";
import { WithUrl } from "~/utils/withUrl";
import { EyeFilled } from "@ant-design/icons";
type Person = RouterOutputs["person"]["list"][0];

//=>
export default function PersonList() {
	const [searchTerms, setSearchTerms] = useState({
		search: "",
		deleted: false,
	});
	const lista = api.person.list.useQuery(searchTerms);

	const [modalImages, setModalImages] = useState<Person["images"] | null>(null);
	const [selected, setSelected] = useState<Person | null>(null);
	const columns: ColumnProps<Person>[] = [
		{
			title: "Imagenes",
			render(_, row) {
				return (
					<div
						className="tw-flex tw-flex-wrap tw-h-[50px] tw-justify-center tw-items-center tw-relative"
						style={{
							cursor: row.images.length > 0 ? "pointer" : "default",
						}}
						onClick={() => {
							if (row.images.length > 0) setModalImages(row.images);
						}}
					>
						{row.images.length > 0 ? (
							<>
								<div
									className="tw-h-[50px] tw-w-[50px] tw-absolute hover:tw-bg-gray-200 hover:tw-opacity-50 tw-justify-start
                      tw-flex
                      tw-items-center
                      tw-opacity-0
                      tw-rounded-full
                      "
								>
									<div className="tw-m-auto">
										<EyeFilled color="#000000" />
									</div>
								</div>
								<Image
									quality={20}
									src={WithUrl(row.images[0]?.key ?? "")}
									alt="avatar"
									width={50}
									height={50}
								/>
							</>
						) : (
							"N/A"
						)}
					</div>
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
				if (!row.birthdate) return null;
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
			title: "Es...",
			key: "createdAt",
			width: 200,
			render: (_: unknown, person) => {
				return (
					<>
						{person.volunteer ? (
							<Tag color="green">Voluntario</Tag>
						) : (
							<Tag color="red">No es voluntario</Tag>
						)}
						{person.providers?.length > 0 ? (
							<Tag color="green">Proveedor</Tag>
						) : (
							<Tag color="red">No es proveedor</Tag>
						)}
					</>
				);
			},
		},
		{
			title: "Acciones",
			key: "actions",
			render: (_: unknown, person) => {
				return (
					<div className="tw-flex tw-gap-2">
						<Button
							size="small"
							onClick={() => {
								setSelected(person);
								setModal(true);
							}}
							type="primary"
						>
							Editar
						</Button>
						<Popconfirm title="¿Desea eliminar esta persona?">
							<Button size="small" danger>
								Eliminar
							</Button>
						</Popconfirm>
					</div>
				);
			},
		},
	];
	const global = useGlobalContext();
	const [modal, setModal] = useState(false);
	const [form] = useForm();
	const upsertPerson = api.person.upsertPerson.useMutation({
		async onMutate() {
			form.resetFields();
		},
		async onSuccess() {
			await lista.refetch();
			void global?.messageApi.success(
				"Persona creada/actualizada correctamente",
			);
			setModal(false);
		},
	});
	const onFinish = (values: FormPersonOutput) => {
		void upsertPerson.mutateAsync({
			id: selected?.id ?? "",
			name: values.name,
			f_lastname: values.f_lastname,
			m_lastname: values.m_lastname,
			ci: values.ci,
			gender_id: values.gender_id,
			emails: values.emails,
			phones: values.phones,
			birthdate: values.birthdate?.toISOString() ?? null,
			images: values.images.map((v) => {
				if (v.id?.startsWith("rc-upload")) {
					return {
						key: v.key,
					};
				}
				return v;
			}),
		});
	};
	const [generosModal, setGenerosModal] = useState(false);
	return (
		<div className="tw-m-4 tw-w-full">
			<Modal
				title="Imagenes"
				open={!!modalImages}
				onOk={() => setModalImages(null)}
				onCancel={() => setModalImages(null)}
				width={800}
				footer={null}
				destroyOnClose
			>
				<div className="tw-flex tw-flex-wrap">
					<AntImage.PreviewGroup>
						{modalImages?.map((v) => {
							return (
								<AntImage
									key={v.key}
									src={WithUrl(v.key ?? "")}
									alt="avatar"
									width={50}
									height={50}
								/>
							);
						})}
					</AntImage.PreviewGroup>
				</div>
			</Modal>
			<Modal
				title={`${selected ? "Editar" : "Crear"} Persona`}
				open={modal}
				onOk={() => setModal(false)}
				onCancel={() => setModal(false)}
				width={800}
				footer={null}
				destroyOnClose
			>
				<FormPersons onFinish={onFinish} person={selected} />
			</Modal>
			<Modal
				title="Generos"
				open={generosModal}
				onCancel={() => setGenerosModal(false)}
				width={400}
				footer={null}
			>
				<GenderCrud />
			</Modal>
			<div className="tw-flex">
				<Button onClick={() => setGenerosModal(true)}>Generos</Button>
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
				pagination={false}
				rowKey={(e) => e.id}
				loading={lista.isLoading}
				dataSource={lista.data}
				columns={columns}
			/>
		</div>
	);
}
