import dayjs from "dayjs";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
export const personsRouter = createTRPCRouter({
	toggleDelete: protectedProcedure
		.input(z.object({ id: z.string(), status: z.boolean() }))
		.mutation(({ ctx, input }) => {
			if (ctx.session.user.userType !== "ADMIN") {
				throw new Error("Unauthorized");
			}
			return ctx.db.persons.update({
				where: {
					id: input.id,
				},
				data: {
					deleted_at: input.status ? new Date() : null,
				},
			});
		}),
	list: protectedProcedure
		.input(
			z.object({
				search: z.string().nullish(),
				deleted: z.boolean().nullish(),
			}),
		)
		.query(({ ctx, input }) => {
			if (ctx.session.user.userType !== "ADMIN") {
				throw new Error("Unauthorized");
			}
			return ctx.db.persons.findMany({
				orderBy: {
					updated_at: "desc",
				},
				where: {
					OR: [
						{
							name: {
								contains: input.search ?? "",
							},
						},
						{
							f_lastname: {
								contains: input.search ?? "",
							},
						},
						{
							m_lastname: {
								contains: input.search ?? "",
							},
						},
					],
					AND:
						input.deleted === true
							? { deleted_at: {} }
							: {
									deleted_at: null,
								},
				},
				include: {
					gender: true,
					emails: true,
					phones: true,
					images: true,
					providers: {
						select: {
							id: true,
						},
					},
					user: {
						include: {
							volunteer: true,
						},
					},

					// volunteer: {
					// 	select: {
					// 		id: true,
					// 	},
					// },
				},
			});
		}),
	upsertPerson: protectedProcedure
		.input(
			z.object({
				id: z.string().optional(),
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
			if (ctx.session.user.userType !== "ADMIN") {
				throw new Error("Unauthorized");
			}
			if (input.id) {
				return await ctx.db.persons.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
						f_lastname: input.f_lastname,
						m_lastname: input.m_lastname,
						birthdate: input.birthdate ? dayjs(input.birthdate).toDate() : null,
						ci: input.ci,
						gender_id: input.gender_id,
						images: {
							deleteMany: {
								id: {
									notIn: input.images
										?.map((image) => image.id)
										.filter((id) => id) as string[],
								},
							},
							upsert: input.images?.map((image) => ({
								where: {
									id: image.id ?? "X",
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
										?.map((email) => email.id)
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
									notIn: input.phones
										?.map((phone) => phone.id)
										.filter((id) => id) as string[],
								},
							},
							upsert: input.phones?.map((phone) => ({
								where: {
									id: phone.id,
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
			}
			return await ctx.db.persons.create({
				data: {
					name: input.name,
					f_lastname: input.f_lastname,
					m_lastname: input.m_lastname,
					birthdate: input.birthdate ? dayjs(input.birthdate).toDate() : null,
					ci: input.ci,
					gender_id: input.gender_id,
					images: {
						create:
							input.images?.map((image) => ({
								key: image.key,
							})) ?? [],
					},
					emails: {
						create:
							input.emails.map((email) => ({
								mail: email.property,
							})) ?? [],
					},
					phones: {
						create:
							input.phones?.map((phone) => ({
								phone: phone.property,
							})) ?? [],
					},
				},
			});
		}),

	upsertGender: protectedProcedure
		.input(
			z.object({
				id: z.string().optional(),
				name: z.string().min(1),
			}),
		)
		.mutation(({ ctx, input }) => {
			if (ctx.session.user.userType !== "ADMIN") {
				throw new Error("Unauthorized");
			}
			return ctx.db.genders.upsert({
				where: {
					id: input.id ?? "X",
				},
				create: {
					name: input.name,
				},
				update: {
					name: input.name,
				},
			});
		}),
	deleteGender: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) => {
			if (ctx.session.user.userType !== "ADMIN") {
				throw new Error("Unauthorized");
			}
			return ctx.db.genders.delete({
				where: { id: input.id },
			});
		}),
	listGenders: publicProcedure.query(({ ctx }) => {
		return ctx.db.genders.findMany();
	}),
});
