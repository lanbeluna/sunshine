import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { completeEmailRedirect } from '@/services/supabase/auth';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    const target = searchParams.get('redirect');
    return target?.startsWith('/') ? target : '/profile';
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    completeEmailRedirect(window.location.href).then((result) => {
      if (cancelled) return;
      if (result.ok && result.user) {
        navigate(redirectTo, { replace: true });
        return;
      }
      if (result.ok) {
        navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`, { replace: true });
        return;
      }
      setError(result.error);
    });

    return () => {
      cancelled = true;
    };
  }, [navigate, redirectTo]);

  return (
    <main className="ql-soft-surface flex min-h-dvh justify-center px-4 py-[max(1rem,env(safe-area-inset-top))] text-[var(--ql-ink)]">
      <div className="flex w-full max-w-[430px] items-center">
        <Card className="w-full space-y-4 text-center">
          {error ? (
            <>
              <h1 className="text-2xl font-black">邮箱验证没有完成</h1>
              <p className="text-sm leading-6 text-[var(--ql-muted)]">{error}</p>
              <Link className="font-bold text-[var(--ql-accent)] underline underline-offset-4" to="/login">
                返回登录
              </Link>
            </>
          ) : (
            <>
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--ql-accent)]" />
              <h1 className="text-2xl font-black">正在完成邮箱验证</h1>
              <p className="text-sm leading-6 text-[var(--ql-muted)]">验证成功后会自动进入个人页。</p>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
