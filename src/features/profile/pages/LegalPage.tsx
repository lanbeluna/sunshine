import { ProfileSubPageLayout } from '@/features/profile/components/ProfileSubPageLayout';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const BODY = `欢迎使用 QL轻旅（以下简称「本应用」）。在使用本应用前，请您仔细阅读以下条款。本协议为演示占位文本，不构成任何法律意见或正式合同。

一、服务说明。本应用提供旅行灵感、AI 决策演示与本地收藏等功能，部分内容为演示数据，可能随时变更或下线。

二、账户与数据。您在本应用中的偏好、收藏与决策记录默认存储于本地浏览器。清除缓存或更换设备可能导致数据无法恢复，请自行备份重要信息。

三、用户行为规范。您不得利用本应用从事违法、侵权或干扰他人正常使用的行为。对于演示环境中的用户生成内容，本平台不对其真实性、合法性作担保。

四、隐私与信息。我们可能收集设备与使用统计信息以改进产品（演示版本可能未实际收集）。若未来接入第三方服务，将在更新后的政策中说明。

五、免责声明。因不可抗力、网络故障或您自身原因导致的损失，本应用在法律允许范围内不承担责任。

六、协议更新。我们保留随时修订本协议的权利，修订后将通过应用内提示告知。继续使用即视为接受更新后的条款。

七、联系我们。如有疑问，请通过应用内反馈入口与我们联系（演示环境可为空）。

感谢您对 QL轻旅 的信任与支持。`;

export default function LegalPage() {
  const { theme } = useAppContext();
  const light = theme === 'light';

  return (
    <ProfileSubPageLayout title="用户协议 & 隐私政策">
      <article className={cn('px-4 py-6 text-sm leading-relaxed', light ? 'text-zinc-700' : 'text-wander-secondary')}>
        {BODY.split('\n\n').map((p, i) => (
          <p key={i} className="mb-4 whitespace-pre-wrap last:mb-0">
            {p}
          </p>
        ))}
      </article>
    </ProfileSubPageLayout>
  );
}
