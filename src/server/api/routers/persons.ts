import dayjs from "dayjs";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
export const personsRouter = createTRPCRouter({
	// upsert: protectedProcedure
	//   .input(z.object({
	//     id: z.string().optional(),
	//     name: z.string(),
	//     lastname: z.string().nullish()
	//     emails: z.array(z.object(
	//       {
	//         email: z.string().email(),
	//         comment: z.string().nullable().optional()
	//       }
	//     )).optional(),
	//     biometricId: z.string().nullable().optional(),
	//     phones: z.array(z.object(
	//       {
	//         phone: z.string(),
	//         comment: z.string().nullable().optional()
	//       }
	//     )),
	//     userId: z.string().nullable().optional(),
	//     skills: z.array(z.string()).optional(),
	//     procedences: z.array(z.string()).nullable().optional(),
	//     birthdate: z.string().datetime().nullable().optional(),
	//     gender: z.string().optional(),
	//     image: z.string().optional()
	//   }))
	//   .mutation(async ({ ctx, input }) => {

	//     return ctx.db.volunteers.upsert({
	//       where: {
	//         id: input.id ?? "X"
	//       },
	//       create: {

	//         name: input.name,
	//         lastname: input.lastname,
	//         emails: input.emails,
	//         biometricId: input.biometricId,
	//         phones: input.phones,
	//         userId: input.userId,
	//         skills: {
	//           connect: input.skills?.map((s) => ({ id: s }))
	//         },
	//         procedence: {
	//           connect: input.procedences?.map((s) => ({ id: s }))
	//         },
	//         birthdate: input.birthdate,
	//         genderId: input.gender,
	//         image: input.image
	//       },
	//       update: {
	//         name: input.name,
	//         image: input.image
	//       }
	//     })
	//   }),
	list: protectedProcedure.query(({ ctx }) => {
		return ctx.db.persons.findMany({
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
				volunteers: {
					select: {
						id: true,
					},
				},
			},
		});
	}),
	upsertPerson: protectedProcedure
		.input(z.object({
      id: z.string().optional(),
      name: z.string(),
      f_lastname: z.string().nullish(),
      m_lastname: z.string().nullish(),
      birthdate: z.string().datetime().nullish(),
      ci: z.string().nullish(),
      gender_id: z.string(),
      images: z.array(z.object({
        id: z.string().optional(),
        key: z.string(),
      })),
      emails: z.array(z.object({
        id: z.string().optional(),
        property: z.string(),
      })),
      phones: z.array(
        z.object({
          id: z.string().optional(),
          property: z.string(),
        })
      ),
    }))
		.mutation(async ({ ctx, input }) => {
			if (input.id) {
        return await ctx.db.persons.update({
          where: {
            id: input.id
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
                  notIn: input.images?.map((image) => image.id).filter((id) => id) as string[]
                }
              },
              upsert:
                input.images?.map((image) => ({
                  where: {
                    id: image.id ?? "X"
                  },
                  create: {
                    key: image.key
                  },
                  update: {
                    key: image.key
                  }
                }))
            },
            emails: {
              deleteMany: {
                id: {
                  notIn: input.emails?.map((email) => email.id).filter((id) => id) as string[]
                }
              },
              upsert:
                input.emails.map((email) => ({
                  where: {
                    id: email.id
                  },
                  create: {
                    mail: email.property
                  },
                  update: {
                    mail: email.property
                  }
                }))
            },
            phones: {
              deleteMany: {
                id: {
                  notIn: input.phones?.map((phone) => phone.id).filter((id) => id) as string[]
                }
              },
              upsert:
                input.phones?.map((phone) => ({
                  where: {
                    id: phone.id
                  },
                  create: {
                    phone: phone.property
                  },
                  update: {
                    phone: phone.property
                  }
                }))
            },
          }
        })
				
			}
			return  await ctx.db.persons.create({
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
			return ctx.db.genders.delete({
				where: { id: input.id },
			});
		}),
	listGenders: protectedProcedure.query(({ ctx }) => {
		return ctx.db.genders.findMany();
	}),
	// delete: protectedProcedure
	//   .input(z.object({ id: z.string() }))
	//   .mutation(async ({ ctx, input }) => {
	//     return ctx.db.volunteers.delete({
	//       where: { id: input.id },
	//     })
	//   })

	// create: protectedProcedure
	//   .input(z.object({ name: z.string().min(1) }))
	//   .mutation(async ({ ctx, input }) => {
	//     // simulate a slow db call
	//     await new Promise((resolve) => setTimeout(resolve, 1000));

	//     return ctx.db.post.create({
	//       data: {
	//         name: input.name,
	//         createdBy: { connect: { id: ctx.session.user.id } },
	//       },
	//     });
	//   }),

	// getLatest: protectedProcedure.query(({ ctx }) => {
	//   return ctx.db.post.findFirst({
	//     orderBy: { createdAt: "desc" },
	//     where: { createdBy: { id: ctx.session.user.id } },
	//   });
	// }),
});
