"use client";
import {
	Descriptions,
	type DescriptionsProps,
	Image,
	Modal,
	Button,
	Typography,
	Card,
	Divider,
} from "antd";
import dayjs from "dayjs";
import { api } from "~/trpc/react";
import FormPersons, { type FormPersonOutput } from "./FormPersons";
import { useState } from "react";
import { WithUrl } from "~/utils/withUrl";
import { useGlobalContext } from "../globalContext";
export default function ProfileDiscord() {
	const profile = api.profile.profile.useQuery();
	const itemsDiscord: DescriptionsProps["items"] = [
		{
			key: "3d",
			label: "Pfp",
			children: (
				<>
					{profile.data?.image ? (
						<Image
							alt="image"
							src={profile.data?.image}
							width={50}
							height={50}
						/>
					) : (
						"-"
					)}
				</>
			),
		},
		{
			key: "1d",
			label: "Usuario",
			children: profile.data?.name ?? "-",
		},
		{
			key: "2d",
			label: "Email",
			children: profile.data?.email ?? "-",
		},
	];
	const itemsPersona: DescriptionsProps["items"] = [
		{
			key: "1dp",
			label: "Nombre",
			children:
				`${profile.data?.person?.name ?? ""} ${
					profile.data?.person?.f_lastname ?? ""
				} ${profile.data?.person?.m_lastname ?? ""}` ?? "-",
		},
		{
			key: "2p",
			label: "Fecha de nacimiento",
			children: profile.data?.person?.birthdate ? (
				<div>
					{dayjs(profile.data?.person?.birthdate).format("DD/MM/YYYY")} Edad:{" "}
					{dayjs().diff(profile.data?.person?.birthdate, "year")} años
				</div>
			) : (
				"-"
			),
		},
		{
			key: "3p",
			label: "Genero",
			children: profile.data?.person?.gender?.name ?? "-",
		},
		{
			key: "4p",
			label: "Correos de contacto",
			children:
				profile.data?.person?.emails.map((v) => v.mail).join(",") ?? "-",
		},
		{
			key: "5p",
			label: "Telefonos de contacto",
			children:
				profile.data?.person?.phones.map((v) => v.phone).join(",") ?? "-",
		},
		{
			key: "6p",
			label: "Miembro desde",
			children: profile.data?.person?.created_at ? (
				<div>
					{dayjs(profile.data?.person?.created_at).format("DD/MM/YYYY")} {" - "}
					{dayjs().diff(profile.data?.person?.created_at, "day")} Dias
				</div>
			) : (
				"-"
			),
		},
	];
	const global = useGlobalContext();
	const profileUpdate = api.profile.updatePersonal.useMutation({
		onSuccess: () => {
			setModal(false);
			void profile.refetch();
			void global?.messageApi.success("Perfil actualizado correctamente");
		},
	});
	const onFinish = (values: FormPersonOutput) => {
		profileUpdate.mutate({
			...values,
			id: profile.data?.person?.id ?? "",
			birthdate: values.birthdate?.toISOString() ?? null,
		});
	};
	const [modal, setModal] = useState(false);
	return (
		<Card title="Tu perfil" size="small">
			<Modal
				title="Editar Perfil"
				onCancel={() => setModal(false)}
				open={modal}
				footer={null}
			>
				<FormPersons onFinish={onFinish} person={profile.data?.person} />
			</Modal>
			<Descriptions size="small" title="En Discord" items={itemsDiscord} />
			<Divider />
			<Descriptions
				size="small"
				title={
					<div>
						En FabLab{" "}
						<Button size="small" onClick={() => setModal(true)}>
							Editar Perfil
						</Button>
					</div>
				}
				items={itemsPersona}
			/>
			<div>
				{profile.data?.person?.images &&
				profile.data.person.images.length > 0 ? (
					<div>
						<Typography.Title level={5}>Imagenes</Typography.Title>
						<div className="tw-flex tw-gap-2">
							{profile.data.person.images.map((v) => (
								<div key={v.id}>
									<Image alt="image" src={WithUrl(v.key)} width={50} />
								</div>
							))}
						</div>
					</div>
				) : (
					<div>No hay imagenes</div>
				)}
			</div>
		</Card>
	);
}
