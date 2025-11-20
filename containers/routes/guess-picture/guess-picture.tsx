'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export const GuessPicture = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const questions = [
    {
      id: 1,
      text: 'موز',
      isCorrect: true,
    },
    {
      id: 2,
      text: 'پرتقال',
      isCorrect: false,
    },
    {
      id: 3,
      text: 'انجیر',
      isCorrect: false,
    },
    {
      id: 4,
      text: 'سیب',
      isCorrect: false,
    },
  ];
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

  return (
    <section>
      <div className="container">
        <div className="border rounded-xl p-4 w-[330px] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-primary">بازی حدس تصویر</p>
            {isPlaying && (
              <CountdownCircleTimer
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
              src="/images/temp/image.avif"
              alt="guess picture"
              width={300}
              height={300}
              className="rounded-xl"
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
            <button className="bg-primary text-white rounded-xl p-3 w-full">
              بعدی
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
