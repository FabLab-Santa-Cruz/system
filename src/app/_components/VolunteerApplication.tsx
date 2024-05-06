"use client";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import {
	Button,
	Card,
	Form,
	List,
	Modal,
	Popover,
	Tag,
	Typography,
} from "antd";
import { useMemo, useState } from "react";
import { MdQuestionMark } from "react-icons/md";
import { api } from "~/trpc/react";

/**
 * Allow users to register as volunteers
 *
 */
export default function VolunteerApplication() {
	const applications = api.profile.applications.useQuery();
	const [modal, setModal] = useState(false);
	const ReactQuill = useMemo(
		() => dynamic(() => import("react-quill"), { ssr: false }),
		[],
	);
	const [form] = Form.useForm();
	const applicate = api.profile.applicateVolunteer.useMutation({
		onMutate() {
			setModal(false);
		},
		onSuccess() {
			void applications.refetch();
		},
	});
	const onFinish = (values: {
		message?: string;
	}) => {
		console.log(values);
		void applicate.mutateAsync({
			why: values.message ?? "Sin Mensaje.",
		});
	};
	const deleteApplication = api.profile.deleteApplication.useMutation({
		onSuccess() {
			void applications.refetch();
		},
	});

	const pushDeleteApplication = (id: string) => {
		void deleteApplication.mutateAsync({ id });
	};
	return (
		<div>
			<Modal
				open={modal}
				onCancel={() => setModal(false)}
				footer={null}
				title="Solicitar voluntariado"
				centered
				width={800}
			>
				<Tag color="blue">
					Puedes contarnos por que quieres el voluntariado?
				</Tag>
				<Form layout="vertical" form={form} onFinish={onFinish}>
					<Form.Item name={"message"} label="Lo quiero porque...">
						<ReactQuill />
					</Form.Item>
					<Button
						htmlType="submit"
						type="primary"
						loading={applicate.isPending}
					>
						Aplicar
					</Button>
				</Form>
			</Modal>
			<Card
				title={
					<div className="tw-flex tw-gap-2">
						<Typography.Text>Mis aplicaciones de voluntariado</Typography.Text>{" "}
						<Button
							type="primary"
							size="small"
							loading={applications.isLoading}
							disabled={
								!!applications.data?.find(
									(a) => a.status === "ACCEPTED" || a.status === "PENDING",
								)
							}
							onClick={() => {
								setModal(true);
							}}
						>
							Aplicar
						</Button>
						<Popover content="Puedes ver tus solicitudes de voluntariado aca, solo puedes tener una aplicacion pendiente">
							<Button size="small" icon={<MdQuestionMark />} />
						</Popover>
					</div>
				}
				size="small"
			>
				<List
					loading={applications.isLoading}
					dataSource={applications.data}
					renderItem={(a) => {
						let estado = a.status === "ACCEPTED" ? "Aceptado" : "Pendiente";
						if (a.status === "REJECTED") estado = "Rechazado";
						let color = a.status === "ACCEPTED" ? "green" : "blue";
						if (a.status === "REJECTED") color = "red";
						return (
							<List.Item
								key={a.id}
								actions={[
									<div key={1} className="tw-flex tw-flex-wrap">
										{a.approved_by && (
											<Tag color="gold">{a.approved_by.name}</Tag>
										)}
										<Tag color={color}>{estado}</Tag>
										{a.status === "PENDING" ? (
											<Button
												danger
												size="small"
												key={2}
												onClick={() => pushDeleteApplication(a.id)}
											>
												Eliminar aplicacion
											</Button>
										) : null}
									</div>,
								]}
							>
								<List.Item.Meta
									description={
										<div
											dangerouslySetInnerHTML={{
												__html: a.message,
											}}
										/>
									}
								/>
							</List.Item>
						);
					}}
				/>
			</Card>
		</div>
	);
}
