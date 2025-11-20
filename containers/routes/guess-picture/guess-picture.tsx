'use client';

import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

type ZoomPosition = {
  x: number;
  y: number;
  scale: number;
};

const generateRandomZoom = (): ZoomPosition => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  scale: 2.5 + Math.random() * 2,
});

export const GuessPicture = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [zoomPosition, setZoomPosition] = useState<ZoomPosition>({
    x: 50,
    y: 50,
    scale: 1,
  });

  const {
    data: guessPicture,
    isLoading,
    refetch,
  } = trpc.guessPicture.getRandom.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const questions = guessPicture?.questions || [];

  const correctQuestion = useMemo(
    () => questions.find((q) => q.isCorrect),
    [questions],
  );

  useEffect(() => {
    if (guessPicture) {
      setZoomPosition(generateRandomZoom());
    }
  }, [guessPicture]);

  const handleTimerComplete = () => {
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
    setTimerKey((prev) => prev + 1);
    await refetch();
    setIsLoadingNext(false);
  };

  const getButtonClassName = (
    isSelected: boolean,
    isCorrect: boolean,
    hasSelection: boolean,
  ): string => {
    let className = 'border rounded-xl text-sm p-3 w-full transition-all';
    if (hasSelection) {
      if (isCorrect) {
        className += ' bg-green-500 text-white border-green-500';
      } else if (isSelected) {
        className += ' bg-red-500 text-white border-red-500';
      }
      className += ' cursor-not-allowed bg-gray-50 opacity-80';
    } else {
      className += ' hover:border-primary';
    }
    return className;
  };

  if (isLoading || isLoadingNext) {
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

  if (!guessPicture) {
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

  const hasSelection = selectedId !== null;

  return (
    <section>
      <div className="container">
        <div className="border rounded-xl p-4 w-[330px] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-primary">بازی حدس تصویر</p>
            {isPlaying && (
              <CountdownCircleTimer
                key={timerKey}
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
          <div className="flex items-center justify-center overflow-hidden rounded-xl">
            <div className="relative w-[300px] h-[300px] aspect-square">
              <Image
                src={guessPicture.image}
                alt="guess picture"
                fill
                className="rounded-xl object-cover"
                style={{
                  objectPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transform: `scale(${zoomPosition.scale})`,
                  filter: 'blur(4px)',
                }}
                unoptimized
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {questions.map((question) => {
              const isSelected = selectedId === question.id;
              const isCorrect = question.isCorrect;
              return (
                <button
                  key={question.id}
                  onClick={() => handleSelect(question.id)}
                  disabled={hasSelection}
                  className={getButtonClassName(
                    isSelected,
                    isCorrect,
                    hasSelection,
                  )}
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
