'use client';

import { InputImage } from '@/components/input-image';
import { InputQuestion } from '@/components/input-question';
import { Modal } from '@/components/modal';
import { useModal } from '@/hooks/modal';
import { TGuessPicture } from '@/types/guess-picture';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 20 * 1024 * 1024, {
          message: 'حجم فایل باید کمتر از 20 مگابایت باشد',
        })
        .refine((file) => file.type.startsWith('image/'), {
          message: 'فایل باید یک تصویر باشد',
        }),
      z.null(),
    ])
    .refine((file) => file !== null, {
      message: 'لطفا تصویر را انتخاب کنید',
    }),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, 'لطفا متن سوال را وارد کنید'),
        isCorrect: z.boolean(),
      }),
    )
    .length(4, 'باید 4 سوال وارد کنید')
    .refine((questions) => questions.some((q) => q.isCorrect), {
      message: 'حداقل یک پاسخ صحیح باید انتخاب شود',
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface IModalItemProps {
  modalKey: string;
  item?: TGuessPicture;
  mode: 'edit' | 'add';
  btn?: ReactNode;
}

export const ModalItem = (props: IModalItemProps) => {
  const modal = useModal(props.modalKey);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null,
      questions: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  });

  const handleBtnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.show();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log('Form data:', data);
      toast.success(
        props.mode === 'edit' ? 'با موفقیت ویرایش شد' : 'با موفقیت افزوده شد',
      );
      modal.hide();
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('خطا در ارسال فرم');
    }
  };

  return (
    <>
      {props.btn && <div onClick={handleBtnClick}>{props.btn}</div>}
      <Modal
        isOpen={modal.isShow}
        onClose={modal.hide}
        className="max-w-[350px] sm:max-w-[500px]"
        title={props.mode === 'edit' ? 'ویرایش' : 'افزودن'}
        footer={
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="rounded-lg w-full bg-primary px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {form.formState.isSubmitting
              ? 'در حال ارسال...'
              : props.mode === 'edit'
                ? 'ویرایش'
                : 'افزودن'}
          </button>
        }
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center justify-center">
            <Controller
              name="image"
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <InputImage
                  value={value}
                  setValue={onChange}
                  error={form.formState.errors.image?.message}
                />
              )}
            />
          </div>
          <InputQuestion
            control={form.control}
            setValue={form.setValue}
            errors={form.formState.errors}
          />
        </form>
      </Modal>
    </>
  );
};
