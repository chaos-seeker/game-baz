'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Header() {
  return (
    <header>
      <div className="container rounded-b-2xl bg-white border">
        <div className="flex w-full justify-center p-3">
          <Tabs />
        </div>
      </div>
    </header>
  );
}

const Tabs = () => {
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const data = [{ label: 'حدس تصویر', href: '/guess-picture' }];

  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeTab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      if (window.innerWidth < 1024) {
        const tabRect = activeTab.getBoundingClientRect();
        const scrollLeft =
          activeTab.offsetLeft - containerRect.width / 2 + tabRect.width / 2;
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth lg:justify-center lg:overflow-x-visible"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {data.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            ref={isActive ? activeTabRef : null}
            href={item.href}
            key={item.href}
            className="shrink-0 snap-center"
          >
            <button
              className={cn(
                'rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-gray-500',
              )}
            >
              {item.label}
            </button>
          </Link>
        );
      })}
    </div>
  );
};
