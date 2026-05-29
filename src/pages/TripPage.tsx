import { useMemo, useState } from 'react';
import { toast } from '@/lib/toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { TripCard } from '@/components/trip/TripCard';
import { TripEmptyState } from '@/components/trip/TripEmptyState';
import { TripSegmented, type TripSegment } from '@/components/trip/TripSegmented';
import { getAllTrips } from '@/data/mockTrips';
import type { Trip } from '@/types/trip';

function isUpcoming(trip: Trip): boolean {
  if (trip.status === 'done') return false;
  const end = new Date(trip.endDate + 'T23:59:59');
  return end.getTime() >= Date.now();
}

function isPast(trip: Trip): boolean {
  if (trip.status === 'done') return true;
  const end = new Date(trip.endDate + 'T23:59:59');
  return end.getTime() < Date.now();
}

export default function TripPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [segment, setSegment] = useState<TripSegment>('upcoming');

  const allTrips = useMemo(() => getAllTrips(), [location.key, location.pathname]);

  const upcoming = useMemo(() => allTrips.filter(isUpcoming), [allTrips]);
  const past = useMemo(() => allTrips.filter(isPast), [allTrips]);

  const list = segment === 'upcoming' ? upcoming : past;

  const openTrip = (trip: Trip) => {
    navigate(`/trip/${trip.id}`);
  };

  return (
    <PageContainer>
      <header className="px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="ql-glass overflow-hidden rounded-[1.5rem] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wander-coral">Trip Folder</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-white">我的行程</h1>
              <p className="mt-1 text-xs leading-relaxed text-white/50">把灵感变成可出发的旅行计划</p>
            </div>
            <Link
              to="/decision"
              onClick={() => toast.success('新建行程', { description: '将前往 AI 决策页生成灵感。' })}
              className="ql-focus shrink-0 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-zinc-950 transition-transform active:scale-[0.96]"
            >
              + 新建
            </Link>
          </div>
        </div>
      </header>

      <TripSegmented value={segment} onChange={setSegment} />

      <div className="mt-4 flex flex-col gap-3 px-4 pb-6">
        {list.length === 0 ? (
          <TripEmptyState />
        ) : (
          list.map((trip, index) => (
            <TripCard key={trip.id} trip={trip} index={index} onOpen={() => openTrip(trip)} />
          ))
        )}
      </div>
    </PageContainer>
  );
}
