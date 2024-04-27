"use client";
import dayjs from "dayjs";
import { Button, Popconfirm, Modal, Divider, Typography } from "antd";
import Table, { type ColumnProps } from "antd/es/table";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/server/api/root";
import { MdDelete, MdEdit } from "react-icons/md";
import Image from "next/image";
import { WithUrl } from "~/utils/withUrl";
import { useState } from "react";
import CreateBrand from "./UpsertBrands";
import UpsertBrands from "./UpsertBrands";
type Brand = RouterOutputs["brand"]["list"][0];
export default function Marcas() {
	const brands = api.brand.list.useQuery();
	const deleteBrand = api.brand.delete.useMutation({
		async onSuccess() {
			await brands.refetch();
		},
	});
	const columns: ColumnProps<Brand>[] = [
		{
			title: "Nombre",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Imagen",
			dataIndex: "image",
			key: "image",
			render: (image: string) => {
				if (image) {
					return (
						<Image alt="image" src={WithUrl(image)} width={50} height={50} />
					);
				}
				return "N/A";
			},
		},
		{
			title: "Creado",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (createdAt: string) => {
				return dayjs(createdAt).format("DD/MM/YYYY");
			},
		},
		{
			title: "Actualizado",
			dataIndex: "updatedAt",
			key: "updatedAt",
			render: (updatedAt: string) => {
				return dayjs(updatedAt).format("DD/MM/YYYY");
			},
		},
		{
			// Actions
			title: "Acciones",
			dataIndex: "actions",
			key: "actions",
			render: (_: unknown, brand: Brand) => {
				return (
					<div className="tw-flex tw-gap-2">
						<Popconfirm
							title="¿Desea eliminar esta marca?"
							onConfirm={async () => {
								await deleteBrand.mutateAsync({ id: brand.id });
							}}
						>
							<Button danger icon={<MdDelete />} />
						</Popconfirm>
						<Button onClick={() => setModalEdit(brand)} icon={<MdEdit />} />
					</div>
				);
			},
		},
	];
	const [modalEdit, setModalEdit] = useState<Brand | null>(null);
	return (
		<div className="tw-m-2 tw-flex tw-w-full  tw-justify-center">
			<Modal
				title="Editar marca"
				open={!!modalEdit}
				onOk={() => setModalEdit(null)}
				onCancel={() => setModalEdit(null)}
				footer={null}
				destroyOnClose
			>
				<UpsertBrands
					brand={modalEdit}
					successCallback={() => setModalEdit(null)}
				/>
			</Modal>
			<div className="tw-basis-1/2">
				<Divider>
					<Typography.Title level={5}>Marcas</Typography.Title>
				</Divider>
				<Table
					loading={brands.isLoading}
					rowKey={(brand) => brand.id}
					columns={columns}
					dataSource={brands.data}
				/>
			</div>
			<div className="tw-basis-1/2">
				<Divider>
					<Typography.Title level={5}>this is good </Typography.Title>
				</Divider>
				<CreateBrand />
			</div>
		</div>
	);
}
