"use client";

import { Button, Card, Popconfirm, Switch, Table, Tag, Typography } from "antd";
import { type ColumnProps } from "antd/es/table";
import { useState } from "react";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { useGlobalContext } from "../state/globalContext";

/**
 * Objective: allow admins to approve or decline volunteer applications
 */
type Request = RouterOutputs["volunteer"]["listVolunteerRequests"][0];
export default function VolunteersRequests() {
	const [params, setParams] = useState({
		only_pending: true,
	});
	const utils = api.useUtils();
	const global = useGlobalContext();
	const evaluateRequest = api.volunteer.evaluateRequest.useMutation({
		onSuccess() {
			void applications.refetch();
			void utils.volunteer.list.refetch(); /// Update volunteer list in other components.
			void global?.messageApi.success("Evaluado correctamente");
		},
	});
	const applications = api.volunteer.listVolunteerRequests.useQuery(params);
	const columns: ColumnProps<Request>[] = [
		{
			title: "Mensaje",
			width: 300,
			key: "message",
			render: (_, row) => {
				return (
					<div>
						<div
							dangerouslySetInnerHTML={{
								__html: row.message,
							}}
						/>
					</div>
				);
			},
		},
		{
			title: "Discord Nick",
			width: 150,
			key: "name",
			render: (_, row) => {
				return row.applicant.name ?? row.applicant.username;
			},
		},
		{
			title: "Email",
			width: 150,
			key: "email",
			render: (_, row) => {
				return row.applicant.email;
			},
		},
		{
			title: "Nombre",
			width: 150,
			key: "name",
			render: (_, row) => {
				const name = `${row.applicant.person?.name ?? ""} ${
					row.applicant.person?.f_lastname ?? ""
				} ${row.applicant.person?.m_lastname ?? ""}`;
				return name.trim() === "" ? "-" : name;
			},
		},
		{
			title: "Extras",
			width: 150,
			key: "extras",
			render: (_, row) => {
				return (
					<div>
						{row.applicant.person?.ci ? `CI: ${row.applicant.person?.ci}` : "-"}
						<br />
						{row.applicant.person?.gender_id
							? `Genero: ${row.applicant.person?.gender?.name}`
							: "-"}
						<br />
						{row.applicant.person?.phones
							? `Telefonos: ${row.applicant.person?.phones
									.map((p) => p.phone)
									.join(", ")}`
							: "-"}
					</div>
				);
			},
		},
		{
			title: "Acciones",
			key: "actions",
			width: 100,
			render: (_, row) => {
				let evStatus = "Pendiente";
				if (row.status === "ENDED") evStatus = "Finalizado";
				if (row.status === "REJECTED") evStatus = "Rechazado";
				if (row.status === "ACCEPTED") evStatus = "Aceptado";

				return row.status === "PENDING" ? (
					<div>
						<Popconfirm
							title="¿Estas seguro de que deseas aprobar la solicitud?"
							onConfirm={() => {
								void evaluateRequest.mutate({
									id: row.id,
									status: "ACCEPTED",
								});
							}}
						>
							<Button className="tw-bg-green-500 tw-text-white">Aprobar</Button>
						</Popconfirm>
						<Popconfirm
							title="¿Estas seguro de que deseas rechazar la solicitud?"
							onConfirm={() => {
								void evaluateRequest.mutate({
									id: row.id,
									status: "REJECTED",
								});
							}}
						>
							<Button className="tw-bg-red-500 tw-text-white">Rechazar</Button>
						</Popconfirm>
					</div>
				) : (
					<Tag color={row.status === "ACCEPTED" ? "green" : "red"}>
						{evStatus}
					</Tag>
				);
			},
		},
	];

	return (
		<div>
			<Card
				title={
					<div className="tw-flex tw-gap-2">
						<Typography.Text>Solicitudes de Voluntarios</Typography.Text>
						<div>
							<span className="tw-text-gray-500">Solo pendientes</span>
							<Switch
								value={params.only_pending}
								onChange={(value) => {
									setParams({ ...params, only_pending: value });
								}}
							/>
						</div>
					</div>
				}
				size="small"
			>
				<Table
					loading={applications.isLoading}
					size="small"
					columns={columns}
					dataSource={applications.data}
				/>
			</Card>
		</div>
	);
}
