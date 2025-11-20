'use client';

import type { TGuessPicture } from '@/types/guess-picture';
import { trpc } from '@/utils/trpc';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Image from 'next/image';
import { useMemo } from 'react';

const columnHelper = createColumnHelper<TGuessPicture>();

export const ListItems = () => {
  const fetchData = trpc.guessPicture.getAll.useQuery();

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
            <span className="text-green-600 font-medium">
              {correctQuestion.text}
            </span>
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
    ],
    [],
  );

  const table = useReactTable({
    data: fetchData.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (fetchData.isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="h-[calc(100vh-190px)] w-full container">
      <div className="flex-1 overflow-auto">
        <div className="w-full rounded-xl overflow-hidden border">
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
  );
};
