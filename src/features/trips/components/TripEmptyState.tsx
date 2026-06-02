import { useNavigate } from 'react-router-dom';
import { Map } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { toast } from '@/lib/toast';

export function TripEmptyState() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={<Map className="h-6 w-6 text-[var(--ql-accent)]" />}
      title="还没有行程草稿"
      description="先生成一个目的地推荐，再把它保存为可继续整理的轻量路线。"
      actionLabel="去生成灵感"
      onAction={() => {
        toast.success('前往旅行灵感生成');
        navigate('/decision');
      }}
    />
  );
}
