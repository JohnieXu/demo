import type { NodesRef } from "@lynx-js/types"
import { PageContainer } from "../../components/PageContainer"
import { useRef } from "@lynx-js/react"

export const CabinList = () => {
  const refreshRef = useRef<NodesRef>(null)
  const onRefresh = () => {}
  return (
    <PageContainer
      className="page-cabin-list"
      showNavBar={true}
      navBarProps={{
        title: '舱位列表',
      }}
    >
      <refresh
        ref={refreshRef}
        className="cabin-list-refresh"
        bindstartrefresh={onRefresh}
      >
        <refresh-header className="cabin-list-refresh__header">
          <text className="cabin-list-refresh__text">正在刷新...</text>
        </refresh-header>
        <view>舱位列表</view>
      </refresh>
    </PageContainer>
  )
}