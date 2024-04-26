import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  
} from "~/server/api/trpc";
import { generatePresignedUrlUpload } from "~/server/minio";

export const uploadRouter = createTRPCRouter({
  getUrl: protectedProcedure
    .input(
      z.object({
        objectName: z.string().optional(),
        expires: z.number().optional(),
        bucket: z.string().optional(),
        maxSize: z.number().optional(),
        contentDisposition: z.string().optional(),
        contentType: z.string().optional(),
        metadata: z.record(z.string()).optional(),
        isPublic: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await generatePresignedUrlUpload(input);
    }),

  
});
