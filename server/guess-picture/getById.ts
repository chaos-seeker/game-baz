import { os } from '@orpc/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import type { TGuessPicture } from '../../types/guess-picture';

export const guessPictureGetById = os
  .input(z.object({ id: z.string() }))
  .output(
    z
      .object({
        id: z.string(),
        image: z.string(),
        questions: z.array(
          z.object({
            id: z.number(),
            text: z.string(),
            isCorrect: z.boolean(),
          }),
        ),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
      .nullable(),
  )
  .handler(
    async ({
      input,
    }: {
      input: { id: string };
    }): Promise<TGuessPicture | null> => {
      const result = await prisma.guessPicture.findUnique({
        where: { id: input.id },
        include: {
          questions: true,
        },
      });

      if (!result) {
        return null;
      }

      return {
        ...result,
        questions: result.questions.map((question) => ({
          id: question.id,
          text: question.text,
          isCorrect: question.isCorrect,
        })),
      };
    },
  );
