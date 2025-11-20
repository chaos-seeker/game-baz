import { TQuestion } from './question';

export type TGuessPicture = {
  id: string;
  image: string;
  questions: TQuestion[];
  createdAt: Date;
  updatedAt: Date;
};
