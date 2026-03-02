/**
 * @fileoverview Mobile navigation container component.
 */

'use client';

import { usePathname } from 'next/navigation';
import { MOBILE_NAV_ITEMS } from '@/lib/constants';
import { MobileNavView } from '../presentation/MobileNavView';

/** Container that detects active route for mobile nav */
export function MobileNavContainer() {
  const pathname = usePathname();
  return <MobileNavView pathname={pathname} items={MOBILE_NAV_ITEMS} />;
}
