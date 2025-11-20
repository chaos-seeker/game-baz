'use client';

import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import { useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export const GuessPicture = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const fetchData = trpc.guessPicture.getRandom.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const questions = fetchData.data?.questions || [];

  const handleTimerComplete = () => {
    const correctQuestion = questions.find((q) => q.isCorrect);
    if (correctQuestion) {
      setSelectedId(correctQuestion.id);
    }
    setIsPlaying(false);
  };

  const handleSelect = (questionId: number) => {
    if (selectedId !== null) return;
    setSelectedId(questionId);
    setIsPlaying(false);
  };

  const handleNext = async () => {
    setIsLoadingNext(true);
    setSelectedId(null);
    setIsPlaying(true);
    setKey((prev) => prev + 1);
    await fetchData.refetch();
    setIsLoadingNext(false);
  };

  if (fetchData.isLoading || isLoadingNext) {
    return (
      <section>
        <div className="container">
          <div className="border rounded-xl p-4 w-[330px] flex flex-col gap-4 items-center justify-center min-h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (!fetchData.data) {
    return (
      <section>
        <div className="container">
          <div className="border rounded-xl p-4 w-[330px] flex flex-col gap-4 items-center justify-center min-h-[400px]">
            <p className="text-gray-500">آیتمی یافت نشد!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container">
        <div className="border rounded-xl p-4 w-[330px] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-primary">بازی حدس تصویر</p>
            {isPlaying && (
              <CountdownCircleTimer
                key={key}
                isPlaying={isPlaying}
                duration={30}
                colors={['#7b60db', '#F7B801', '#dc2626']}
                colorsTime={[30, 10, 0]}
                size={50}
                trailStrokeWidth={6}
                strokeWidth={6}
                onComplete={handleTimerComplete}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            )}
          </div>
          <div className="flex items-center justify-center">
            <Image
              src={fetchData.data.image}
              alt="guess picture"
              width={300}
              height={300}
              className="rounded-xl object-cover"
              unoptimized
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {questions.map((question) => {
              const isSelected = selectedId === question.id;
              const isCorrect = question.isCorrect;
              const hasSelection = selectedId !== null;
              let buttonClass =
                'border rounded-xl text-smp p-3 w-full transition-all';
              if (hasSelection) {
                if (isCorrect) {
                  buttonClass += ' bg-green-500 text-white border-green-500';
                } else if (isSelected) {
                  buttonClass += ' bg-red-500 text-white border-red-500';
                }
              } else {
                buttonClass += ' hover:border-primary';
              }
              if (hasSelection) {
                buttonClass += ' cursor-not-allowed bg-gray-50 opacity-80';
              }

              return (
                <button
                  key={question.id}
                  onClick={() => handleSelect(question.id)}
                  disabled={hasSelection}
                  className={buttonClass}
                >
                  {question.text}
                </button>
              );
            })}
          </div>
          {!isPlaying && (
            <button
              onClick={handleNext}
              className="bg-primary text-white rounded-xl p-3 w-full transition-colors hover:bg-primary/90"
            >
              بعدی
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
