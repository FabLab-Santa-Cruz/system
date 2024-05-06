import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
	profile: protectedProcedure.query(({ ctx }) => {
		return ctx.db.user.findUnique({
			include: {
				person: {
					include: {
						images: true,
						emails: true,
						gender: true,
						phones: true,
					},
				},
			},
			where: { id: ctx.session.user.id },
		});
	}),
	updatePersonal: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
				f_lastname: z.string().nullish(),
				m_lastname: z.string().nullish(),
				birthdate: z.string().datetime().nullish(),
				ci: z.string().nullish(),
				gender_id: z.string(),
				images: z.array(
					z.object({
						id: z.string().optional(),
						key: z.string(),
					}),
				),
				emails: z.array(
					z.object({
						id: z.string().optional(),
						property: z.string(),
					}),
				),
				phones: z.array(
					z.object({
						id: z.string().optional(),
						property: z.string(),
					}),
				),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			//Check if email ids are in deleteable
			const canDelete = await ctx.db.emailsPersons.findMany({
				where: {
					id: {
						in: input.emails.map((v) => v.id).filter((v) => v) as string[],
					},
					deleteable: {
						equals: false,
					},
				},
			});
			if (canDelete.length > 0) {
				input.emails = input.emails.filter(
					(v) => !!canDelete.find((z) => z.id === v.id),
				);
			}
			return await ctx.db.persons.update({
				where: {
					id: input.id,
				},
				data: {
					name: input.name,
					f_lastname: input.f_lastname,
					m_lastname: input.m_lastname,
					birthdate: input.birthdate,
					ci: input.ci,
					gender_id: input.gender_id,
					images: {
						deleteMany: {
							id: {
								notIn: input.images
									.map((image) => image.id)
									.filter((id) => id) as string[],
							},
						},
						upsert: input.images.map((image) => ({
							where: {
								id: image.id,
							},
							create: {
								key: image.key,
							},
							update: {
								key: image.key,
							},
						})),
					},
					emails: {
						deleteMany: {
							id: {
								notIn: input.emails
									.map((email) => email.id)
									.filter((id) => id) as string[],
							},
						},
						upsert: input.emails.map((email) => ({
							where: {
								id: email.id,
							},
							create: {
								mail: email.property,
							},
							update: {
								mail: email.property,
							},
						})),
					},
					phones: {
						deleteMany: {
							id: {
								notIn:
									(input.phones
										?.map((phone) => phone.id)
										?.filter((id) => id) as string[]) ?? [],
							},
						},
						upsert: input.phones.map((phone) => ({
							where: {
								id: phone.id ?? "X",
							},
							create: {
								phone: phone.property,
							},
							update: {
								phone: phone.property,
							},
						})),
					},
				},
			});
		}),
});
