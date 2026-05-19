import { useEffect, useState } from 'react';
import { getInboxUnreadCount } from '@/lib/messagesInboxStore';

/** 订阅收件箱未读数（通知设置变更或已读状态变更时刷新） */
export function useInboxUnread(): number {
  const [n, setN] = useState(() => getInboxUnreadCount());

  useEffect(() => {
    const up = () => setN(getInboxUnreadCount());
    window.addEventListener('ql-inbox-change', up);
    return () => window.removeEventListener('ql-inbox-change', up);
  }, []);

  return n;
}
