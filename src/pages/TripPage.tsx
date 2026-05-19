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
      <header className="flex items-center justify-between px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h1 className="text-xl font-bold tracking-tight text-white">我的行程</h1>
        <Link
          to="/decision"
          onClick={() => toast.success('新建行程', { description: '将前往 AI 决策页生成灵感。' })}
          className="rounded-xl border border-white/10 bg-wander-surface px-3 py-2 text-xs font-semibold text-wander-secondary transition active:scale-[0.96] active:bg-white/5"
        >
          + 新建行程
        </Link>
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
