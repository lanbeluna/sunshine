import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, LockKeyhole, Mail, Plane } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuth } from '@/features/auth/context/useAuth';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, isAuthenticated, isConfigured, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const target = searchParams.get('redirect');
    return target?.startsWith('/') ? target : '/profile';
  }, [searchParams]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!isValidEmail(email)) {
      setFormError('请输入正确的邮箱地址。');
      return;
    }
    if (password.length < 6) {
      setFormError('密码至少需要 6 位。');
      return;
    }

    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (result.ok) {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <main className="ql-soft-surface flex min-h-dvh justify-center px-4 py-[max(1rem,env(safe-area-inset-top))] text-[var(--ql-ink)]">
      <div className="flex w-full max-w-[430px] flex-col">
        <button
          type="button"
          onClick={() => navigate('/decision')}
          className="ql-focus mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ql-soft)] text-[var(--ql-muted)]"
          aria-label="返回灵感首页"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <section className="mb-6">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--ql-accent)] to-[var(--ql-accent-2)] text-white shadow-lg shadow-rose-500/20">
            <Plane className="h-7 w-7" />
          </div>
          <p className="text-sm font-bold text-[var(--ql-accent)]">欢迎回来</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">登录 QL轻旅</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--ql-muted)]">
            登录后可以进入个人页，管理收藏、草稿和旅行偏好。
          </p>
        </section>

        <Card className="space-y-5">
          {!isConfigured ? (
            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              当前未配置 Supabase，登录功能不可用。请先在 Netlify 或本地环境变量中配置 Supabase URL 和 anon key。
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <label className="block space-y-2">
              <span className="text-sm font-bold">邮箱</span>
              <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--ql-card-border)] bg-[var(--ql-soft)] px-3 focus-within:ring-2 focus-within:ring-[var(--ql-accent)]">
                <Mail className="h-4 w-4 text-[var(--ql-muted)]" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--ql-muted)]"
                  disabled={!isConfigured || submitting}
                />
              </span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-bold">密码</span>
              <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--ql-card-border)] bg-[var(--ql-soft)] px-3 focus-within:ring-2 focus-within:ring-[var(--ql-accent)]">
                <LockKeyhole className="h-4 w-4 text-[var(--ql-muted)]" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  autoComplete="current-password"
                  placeholder="至少 6 位"
                  className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--ql-muted)]"
                  disabled={!isConfigured || submitting}
                />
              </span>
            </label>

            {formError || error ? (
              <p className="rounded-2xl bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200" role="alert">
                {formError ?? error}
              </p>
            ) : null}

            <Button type="submit" fullWidth disabled={!isConfigured || submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              登录
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--ql-muted)]">
            还没有账号？
            <Link className="font-bold text-[var(--ql-accent)] underline underline-offset-4" to={`/register?redirect=${encodeURIComponent(redirectTo)}`}>
              去注册
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
