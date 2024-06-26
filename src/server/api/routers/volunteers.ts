import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const volunteersRouter = createTRPCRouter({
  assistenceVolunteer: protectedProcedure
    .input(
      z.object({
        id: z.string(), //id of the volunteer
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log(input.id, "INPUTTTTTTTTTTT")
      if (ctx.session.user.userType !== "ADMIN")
        throw new Error("Unauthorized");

      const volunteer = await ctx.db.volunteers.findFirst({
          where: {
            id: input.id,
          },
          include: {
            user: {
              include: {
                person: true,
              },
            },
          },
        });
      return {
        volunteer: volunteer,
        assistences: await ctx.db.biometricPosts.findMany({
          orderBy: {
            date: "desc",
          },
          where: {
            who_id: volunteer?.biometric_id ?? "X",
          },
          include: {
            weather_log: {
              include: {
                air_quality_weather: true,
              },
            },
          },
        }),
      };
    }),

  finishVolunteer: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userType !== "ADMIN")
        throw new Error("Unauthorized");

      return await ctx.db.volunteers.update({
        where: {
          id: input,
        },
        data: {
          status: "INACTIVE",
          user: {
            update: {
              userType: "GUEST",
              volunteer_applications: {
                updateMany: {
                  where: {
                    status: "ACCEPTED",
                  },
                  data: {
                    status: "ENDED",
                  },
                },
              },
            },
          },
        },
      });
    }),

  careersVolunteer: protectedProcedure
    .input(
      z.object({
        id: z.string(), //id of the volunteer
        ids: z.array(z.string()), //ids of the careers
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userType !== "ADMIN")
        throw new Error("Unauthorized");
      return await ctx.db.volunteers.update({
        where: {
          id: input.id,
        },
        data: {
          careers: {
            set: [],
            connect: input.ids.map((id) => ({ id })),
          },
        },
      });
    }),
  procedenceVolunteer: protectedProcedure
    .input(
      z.object({
        id: z.string(), //id of the volunteer
        ids: z.array(z.string()), //ids of the procedences
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userType !== "ADMIN")
        throw new Error("Unauthorized");
      return await ctx.db.volunteers.update({
        where: {
          id: input.id,
        },
        data: {
          procedence: {
            set: [],
            connect: input.ids.map((id) => ({ id })),
          },
        },
      });
    }),

  deleteProcedence: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userType !== "ADMIN")
        throw new Error("Unauthorized");
      return await ctx.db.procedence.delete({
        where: {
          id: input.id,
        },
      });
    }),
  upsertProcedence: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userType !== "ADMIN")
        throw new Error("Unauthorized");
      return ctx.db.procedence.upsert({
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

  procedences: protectedProcedure.query(({ ctx }) => {
    return ctx.db.procedence.findMany();
  }),

  evaluateRequest: protectedProcedure
    .input(
      z.object({
        id: z.string(), //Request id
        status: z.enum(["PENDING", "REJECTED", "ACCEPTED", "ENDED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userType !== "ADMIN")
        throw new Error("Unauthorized");
      const request = await ctx.db.volunteerApplication.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!request) throw new Error("No se encontro esa solicitud");
      const volunteer = await ctx.db.volunteers.findFirst({
        where: {
          user_id: request.user_id,
        },
      });
      if (input.status === "ENDED") {
        if (!volunteer) {
          ///No se puede dar de baja a un voluntario que no existe
          throw new Error("No se encontro ese voluntario");
        }
        return await ctx.db.$transaction([
          ctx.db.user.update({
            where: {
              id: request.user_id,
            },
            data: {
              userType: "GUEST",
            },
          }),
          ctx.db.volunteerApplication.update({
            where: {
              id: input.id,
            },
            data: {
              status: input.status,
              approved_by_id: ctx.session.user.id,
            },
          }),
          ctx.db.volunteers.update({
            where: {
              id: volunteer.id,
            },
            data: {
              status: "INACTIVE",
            },
          }),
        ]);
      }
      if (input.status === "ACCEPTED") {
        //Check if volunter existd once
        if (!volunteer) {
          //Create volunteer
          await ctx.db.volunteers.create({
            data: {
              user_id: request.user_id,
            },
          });
        }
        if (volunteer) {
          await ctx.db.volunteers.update({
            where: {
              id: volunteer.id,
            },
            data: {
              status: "ACTIVE",
            },
          });
        }
        return await ctx.db.$transaction([
          ctx.db.user.update({
            where: {
              id: request.user_id,
            },
            data: {
              userType: "VOLUNTEER",
            },
          }),
          ctx.db.volunteerApplication.update({
            where: {
              id: input.id,
            },
            data: {
              status: input.status,
              approved_by_id: ctx.session.user.id,
            },
          }),
        ]);
      }
      return await ctx.db.volunteerApplication.update({
        where: {
          id: input.id,
        },
        data: {
          status: "REJECTED",
          approved_by_id: ctx.session.user.id,
        },
      });
    }),

  listVolunteerRequests: protectedProcedure
    .input(z.object({ only_pending: z.boolean() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.volunteerApplication.findMany({
        where: {
          ...(input.only_pending ? { status: "PENDING" } : {}),
        },
        include: {
          applicant: {
            include: {
              person: {
                include: {
                  gender: true,
                  phones: true,
                },
              },
            },
          },
        },
      });
    }),

  list: protectedProcedure
    .input(z.object({ search: z.string() }).nullish())
    .query(async ({ ctx, input }) => {
      return await ctx.db.volunteers.findMany({
        where: {
          user: {
            person: {
              OR: [
                {
                  m_lastname: {
                    contains: input?.search ?? "",
                    mode: "insensitive",
                  },
                },
                {
                  f_lastname: {
                    contains: input?.search ?? "",
                    mode: "insensitive",
                  },
                },
                {
                  name: {
                    contains: input?.search ?? "",
                    mode: "insensitive",
                  },
                },
                {
                  emails: {
                    some: {
                      mail: {
                        contains: input?.search ?? "",
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  phones: {
                    some: {
                      phone: {
                        contains: input?.search ?? "",
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            },
          },
        },

        include: {
          careers: true,
          skills: true,
          procedence: true,
          //biometric_posts: true,
          user: {
            include: {
              person: {
                include: {
                  images: true,
                  gender: true,
                  emails: true,
                  phones: true,
                },
              },
            },
          },
        },
      });
    }),
  assignCode: protectedProcedure
    .input(z.object({ id: z.string(), code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userType !== "ADMIN")
        throw new Error("Unauthorized");
      return await ctx.db.volunteers.update({
        where: {
          id: input.id,
        },
        data: {
          biometric_id: input.code,
        },
      });
    }),

  // delete: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.volunteers.delete({
  //       where: { id: input.id },
  //     })
  //   })
});
