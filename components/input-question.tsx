'use client';

import { Check } from 'lucide-react';
import { memo, useCallback } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormSetValue,
  useWatch,
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

interface ToggleButtonProps {
  value: boolean;
  index: number;
  questions: Question[] | undefined;
  setValue: UseFormSetValue<any>;
}

const ToggleButton = memo<ToggleButtonProps>(
  ({ value, index, questions, setValue }) => {
    const handleToggle = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!value) {
          if (questions) {
            questions.forEach((_, i) => {
              setValue(`questions.${i}.isCorrect`, i === index, {
                shouldValidate: true,
              });
            });
          }
        } else {
          setValue(`questions.${index}.isCorrect`, false, {
            shouldValidate: true,
          });
        }
      },
      [value, index, questions, setValue],
    );

    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`absolute right-2 top-1.5 rounded-md p-1.5 transition-colors ${
          value
            ? 'bg-green-100 text-green-600 hover:bg-green-200'
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }`}
        aria-label={value ? 'حذف پاسخ صحیح' : 'انتخاب به عنوان پاسخ صحیح'}
      >
        <Check size={18} className={value ? 'opacity-100' : 'opacity-50'} />
      </button>
    );
  },
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value && prevProps.index === nextProps.index,
);

ToggleButton.displayName = 'ToggleButton';

const getRefineErrorMessage = (questionsError: any): string | undefined => {
  if (!questionsError || typeof questionsError !== 'object') {
    return undefined;
  }

  if (questionsError.root) {
    return (
      questionsError.root.message ||
      (Array.isArray(questionsError.root._errors) &&
        questionsError.root._errors[0])
    );
  }

  if (questionsError.message) {
    return questionsError.message;
  }

  if (Array.isArray(questionsError._errors) && questionsError._errors[0]) {
    return questionsError._errors[0];
  }

  return undefined;
};

export const InputQuestion = <T extends FieldValues>({
  control,
  setValue,
  errors,
}: InputQuestionProps<T>) => {
  const questions = useWatch({
    control,
    name: 'questions' as never,
  }) as Question[] | undefined;

  const questionsError = errors?.questions as any;
  const refineErrorMessage = getRefineErrorMessage(questionsError);

  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((index) => {
        const fieldError = (errors?.questions as any)?.[index]?.text;

        return (
          <div key={index} className="relative">
            <Controller
              name={`questions.${index}.text` as never}
              control={control}
              render={({ field, fieldState }) => (
                <input
                  {...field}
                  type="text"
                  placeholder={`گزینه ${index + 1}`}
                  className={`w-full rounded-lg border px-4 py-2.5 pr-12 text-sm focus:outline-none ${
                    fieldState.error
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-primary'
                  }`}
                  aria-label={`متن گزینه ${index + 1}`}
                  aria-invalid={fieldState.error ? 'true' : 'false'}
                />
              )}
            />
            <Controller
              name={`questions.${index}.isCorrect` as never}
              control={control}
              render={({ field: { value } }) => (
                <ToggleButton
                  value={value}
                  index={index}
                  questions={questions}
                  setValue={setValue}
                />
              )}
            />
            {fieldError && (
              <p className="mt-1 text-xs text-red-500" role="alert">
                {fieldError.message}
              </p>
            )}
            {index === 0 && refineErrorMessage && (
              <p className="mt-1 text-xs text-red-500" role="alert">
                {refineErrorMessage}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
