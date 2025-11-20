'use client';

import { Check } from 'lucide-react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  useWatch,
  UseFormSetValue,
} from 'react-hook-form';

interface Question {
  text: string;
  isCorrect: boolean;
}

interface InputQuestionProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  errors?: FieldErrors<T>;
}

export const InputQuestion = <T extends FieldValues>(props: InputQuestionProps<T>) => {
  const questions = useWatch({
    control: props.control,
    name: 'questions',
  }) as Question[] | undefined;
  return (
    <div
      className="space-y-3"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="relative"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Controller
            name={`questions.${index}.text`}
            control={props.control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder={`سوال ${index + 1}`}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-12 text-sm focus:border-primary focus:outline-none"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              />
            )}
          />
          <Controller
            name={`questions.${index}.isCorrect`}
            control={props.control}
            render={({ field: { value } }) => {
              const handleToggle = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (!value) {
                  // اگر false است، آن را true کن و بقیه را false کن
                  if (questions) {
                    questions.forEach((_, i) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      props.setValue(
                        `questions.${i}.isCorrect` as any,
                        i === index,
                        { shouldValidate: true },
                      );
                    });
                  }
                } else {
                  // اگر true است، آن را false کن
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  props.setValue(`questions.${index}.isCorrect` as any, false, {
                    shouldValidate: true,
                  });
                }
              };

              return (
                <button
                  type="button"
                  onClick={handleToggle}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition-colors ${
                    value
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <Check size={18} className={value ? 'opacity-100' : 'opacity-50'} />
                </button>
              );
            }}
          />
          {props.errors?.questions?.[index]?.text && (
            <p className="mt-1 text-xs text-red-500">
              {props.errors.questions[index]?.text?.message}
            </p>
          )}
        </div>
      ))}
      {props.errors?.questions?.message && (
        <p className="text-xs text-red-500">{props.errors.questions.message}</p>
      )}
    </div>
  );
};

