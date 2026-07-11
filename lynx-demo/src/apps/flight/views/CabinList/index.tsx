import { PageContainer } from "../../components/PageContainer"
import { Refresh } from "lynx-ui"

export const CabinList = () => {
  const onRefresh = () => {}
  return (
    <PageContainer
      className="page-cabin-list"
      showNavBar={true}
      navBarProps={{
        title: '舱位列表',
      }}
    >
      <Refresh className="cabin-list-refresh" onRefresh={onRefresh}>
        <view>舱位列表</view>
      </Refresh>
    </PageContainer>
  )
}
