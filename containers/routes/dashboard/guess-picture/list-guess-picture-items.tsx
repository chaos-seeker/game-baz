'use client';

import { ModalGuessPicture } from '@/containers/layout/dashboard/modal-guess-picture';
import { useModal } from '@/hooks/modal';
import type { TGuessPicture } from '@/types/guess-picture';
import { trpc } from '@/utils/trpc';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<TGuessPicture>();

export const ListGuessPictureItems = () => {
  const utils = trpc.useUtils();
  const fetchData = trpc.guessPicture.getAll.useQuery();
  const [editingItem, setEditingItem] = useState<TGuessPicture | null>(null);
  const editModal = useModal('edit-guess-picture');
  useEffect(() => {
    if (editingItem) {
      editModal.show();
    }
  }, [editingItem, editModal]);
  useEffect(() => {
    if (!editModal.isShow && editingItem) {
      setEditingItem(null);
    }
  }, [editModal.isShow, editingItem]);
  const deleteMutation = trpc.guessPicture.delete.useMutation({
    onSuccess: () => {
      toast.success('با موفقیت حذف شد');
      utils.guessPicture.getAll.invalidate();
    },
  });
  const handleDelete = async (id: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟')) {
      await deleteMutation.mutateAsync({ id });
    }
  };
  const columns = useMemo(
    () => [
      columnHelper.accessor('image', {
        header: 'تصویر',
        cell: (info) => (
          <div className="relative h-16 w-16 overflow-hidden rounded-xl">
            <Image
              src={info.getValue()}
              alt="guess picture"
              fill
              className="object-cover"
            />
          </div>
        ),
      }),
      columnHelper.accessor('questions', {
        header: 'گزینه صحیح',
        cell: (info) => {
          const questions = info.getValue();
          const correctQuestion = questions.find((q) => q.isCorrect);
          return correctQuestion ? (
            <span>{correctQuestion.text}</span>
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'تاریخ ایجاد',
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString('fa-IR');
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'عملیات',
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingItem(item)}
                className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                aria-label="ویرایش"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleteMutation.isPending}
                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                aria-label="حذف"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        },
      }),
    ],
    [deleteMutation.isPending],
  );
  const table = useReactTable({
    data: fetchData.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (fetchData.isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <section className="h-[calc(100vh-190px)] w-full container">
        <div className="flex-1 overflow-auto rounded-xl border">
          <div className="w-full">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-gray-700"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap px-4 py-3 text-sm text-gray-900"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-12 text-center text-gray-500"
                    >
                      آیتمی یافت نشد!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {editingItem && (
        <ModalGuessPicture
          modalKey="edit-guess-picture"
          item={editingItem}
          mode="edit"
        />
      )}
    </>
  );
};
