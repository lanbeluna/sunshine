import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({ title, description, actionLabel, onAction, icon }: Props) {
  return (
    <Card className="mx-auto flex max-w-sm flex-col items-center px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--ql-accent)]/20 to-[var(--ql-accent-2)]/20 text-white">
        {icon ?? <Sparkles className="h-6 w-6 text-[var(--ql-accent)]" />}
      </div>
      <h3 className="text-base font-black tracking-tight text-[var(--ql-ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ql-muted)]">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
