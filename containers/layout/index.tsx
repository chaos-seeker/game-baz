'use client';

import LayoutBase from './base';
import LayoutDashboard from './dashboard';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export default function Layout(props: PropsWithChildren) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');
  const isBase = !pathname?.includes('/dashboard');

  return (
    <div>
      {isBase && <LayoutBase>{props.children}</LayoutBase>}
      {isDashboard && <LayoutDashboard>{props.children}</LayoutDashboard>}
    </div>
  );
}
