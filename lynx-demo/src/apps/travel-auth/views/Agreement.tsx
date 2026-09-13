import { useParams } from 'react-router'
import { AGREEMENT_TITLES, type AgreementTypeValue } from './agreements'
import './Agreement.scss'

/**
 * 协议详情 (PRD §用户协议): renders the agreement content for
 * `/agreement/:type` where :type is one of AgreementType (cmcc/service/privacy/member).
 */
export function Agreement() {
  const { type } = useParams<{ type: AgreementTypeValue }>()
  const title = (type && AGREEMENT_TITLES[type]) || '用户协议'

  return (
    <view className="page-agreement p-4">
      <text className="title text-xl font-bold mb-4">{title}</text>
      {/* TODO(agreement-content): render the actual agreement text / web content. */}
      <text className="placeholder">协议内容加载中…</text>
    </view>
  )
}
