import { Cell, CellGroup } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function CellDemo() {
  return (
    <view>
      <DemoBlock title="基础用法">
        <CellGroup>
          <Cell title="单元格" value="内容" />
          <Cell title="单元格" value="内容" label="描述信息" />
        </CellGroup>
      </DemoBlock>

      <DemoBlock title="链接样式">
        <CellGroup>
          <Cell title="单元格" isLink />
          <Cell title="单元格" isLink value="内容" />
          <Cell title="单元格" isLink value="内容" arrowDirection="up" />
        </CellGroup>
      </DemoBlock>

      <DemoBlock title="分组标题">
        <CellGroup title="分组 1">
          <Cell title="单元格" value="内容" />
        </CellGroup>
        <CellGroup title="分组 2" inset>
          <Cell title="单元格" value="内容" />
          <Cell title="单元格" value="内容" />
        </CellGroup>
      </DemoBlock>

      <DemoBlock title="大尺寸与居中">
        <CellGroup>
          <Cell title="单元格" value="内容" size="large" center />
          <Cell title="单元格" value="内容" size="large" center label="描述" />
        </CellGroup>
      </DemoBlock>

      <DemoBlock title="必填项">
        <CellGroup>
          <Cell title="用户名" value="请输入" required />
          <Cell title="手机号" value="请输入" required />
        </CellGroup>
      </DemoBlock>
    </view>
  )
}
