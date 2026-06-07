import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { TripCard } from '@/features/trips/components/TripCard';
import { TripEmptyState } from '@/features/trips/components/TripEmptyState';
import { TripSegmented, type TripSegment } from '@/features/trips/components/TripSegmented';
import { getAllTrips } from '@/data/mockTrips';
import { toast } from '@/lib/toast';
import type { Trip } from '@/types/trip';

function isUpcoming(trip: Trip): boolean {
  if (trip.status === 'done') return false;
  const end = new Date(`${trip.endDate}T23:59:59`);
  return end.getTime() >= Date.now();
}

function isPast(trip: Trip): boolean {
  if (trip.status === 'done') return true;
  const end = new Date(`${trip.endDate}T23:59:59`);
  return end.getTime() < Date.now();
}

export default function TripPage() {
  const navigate = useNavigate();
  const [segment, setSegment] = useState<TripSegment>('upcoming');

  const allTrips = getAllTrips();
  const upcoming = useMemo(() => allTrips.filter(isUpcoming), [allTrips]);
  const past = useMemo(() => allTrips.filter(isPast), [allTrips]);
  const list = segment === 'upcoming' ? upcoming : past;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Trip folder"
        title="行程草稿"
        description="把推荐结果保存成轻量路线，方便继续整理，不是正式预订。"
        action={
          <Link to="/decision" onClick={() => toast.success('去生成新的旅行灵感')}>
            <Button className="min-h-10 px-3 text-xs">+ 新建</Button>
          </Link>
        }
      />

      <TripSegmented value={segment} onChange={setSegment} />

      <div className="mt-4 flex flex-col gap-3 px-4 pb-6">
        {list.length === 0 ? (
          <TripEmptyState />
        ) : (
          list.map((trip, index) => (
            <TripCard key={trip.id} trip={trip} index={index} onOpen={() => navigate(`/trip/${trip.id}`)} />
          ))
        )}
      </div>
    </PageContainer>
  );
}
