import { guessPictureGetAll } from './guess-picture/getAll';
import { guessPictureGetById } from './guess-picture/getById';
import { guessPictureGetRandom } from './guess-picture/getRandom';
import { guessPictureCreate } from './guess-picture/create';
import { guessPictureUpdate } from './guess-picture/update';
import { guessPictureDelete } from './guess-picture/delete';

export const router = {
  guessPicture: {
    getAll: guessPictureGetAll,
    getById: guessPictureGetById,
    getRandom: guessPictureGetRandom,
    create: guessPictureCreate,
    update: guessPictureUpdate,
    delete: guessPictureDelete,
  },
};

export type AppRouter = typeof router;
