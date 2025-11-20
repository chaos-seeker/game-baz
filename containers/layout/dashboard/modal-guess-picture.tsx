'use client';

import { InputImage } from '@/components/input-image';
import { InputQuestion } from '@/components/input-question';
import { Modal } from '@/components/modal';
import { useModal } from '@/hooks/modal';
import { TGuessPicture } from '@/types/guess-picture';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, useEffect, useRef } from 'react';
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

interface IModalGuessPictureProps {
  modalKey: string;
  item?: TGuessPicture;
  mode: 'edit' | 'add';
  btn?: ReactNode;
}

const defaultFormValues: FormValues = {
  image: null,
  questions: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
};

const base64ToFile = async (
  base64: string,
  filename: string,
): Promise<File> => {
  const response = await fetch(base64);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const ModalGuessPicture = (props: IModalGuessPictureProps) => {
  const modal = useModal(props.modalKey);
  const formRef = useRef<HTMLFormElement>(null);
  const utils = trpc.useUtils();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: defaultFormValues,
  });
  const createMutation = trpc.guessPicture.create.useMutation({
    onSuccess: () => {
      toast.success('با موفقیت افزوده شد');
      utils.guessPicture.getAll.invalidate();
      modal.hide();
      form.reset(defaultFormValues);
    },
  });
  const updateMutation = trpc.guessPicture.update.useMutation({
    onSuccess: () => {
      toast.success('با موفقیت ویرایش شد');
      utils.guessPicture.getAll.invalidate();
      modal.hide();
      form.reset(defaultFormValues);
    },
  });
  useEffect(() => {
    if (!modal.isShow) {
      form.reset(defaultFormValues);
      return;
    }
    if (props.mode === 'edit' && props.item) {
      const loadEditData = async () => {
        try {
          const imageFile = await base64ToFile(props.item!.image, 'image.jpg');
          form.reset({
            image: imageFile,
            questions: props.item!.questions.map((q) => ({
              text: q.text,
              isCorrect: q.isCorrect,
            })),
          });
        } catch (error) {
          console.error('Error loading edit data:', error);
          toast.error('خطا در بارگذاری داده‌های ویرایش');
        }
      };

      loadEditData();
    }
  }, [modal.isShow, props.mode, props.item, form]);
  const handleBtnClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.show();
  };
  const onSubmit = async (data: FormValues) => {
    const imageBase64 = await fileToBase64(data.image!);
    const payload = {
      image: imageBase64,
      questions: data.questions.map((q) => ({
        text: q.text,
        isCorrect: q.isCorrect,
      })),
    };
    if (props.mode === 'edit' && props.item?.id) {
      await updateMutation.mutateAsync({
        id: props.item.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };
  const isSubmitting =
    form.formState.isSubmitting ||
    createMutation.isPending ||
    updateMutation.isPending;

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
            type="button"
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isSubmitting}
            className="rounded-lg w-full bg-primary px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting
              ? 'در حال ارسال...'
              : props.mode === 'edit'
                ? 'ویرایش'
                : 'افزودن'}
          </button>
        }
      >
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
