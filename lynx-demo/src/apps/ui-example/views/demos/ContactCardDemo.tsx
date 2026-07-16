import { useState } from '@lynx-js/react'
import { ContactCard, showToast } from 'lynx-ui'
import { DemoBlock } from '../../components/DemoBlock'

export function ContactCardDemo() {
  const [contact, setContact] = useState({
    name: '张三',
    tel: '13800138000',
  })

  const handleAdd = () => {
    showToast({ message: '添加联系人', duration: 1500 })
  }

  const handleEdit = () => {
    setContact((prev) =>
      prev.name === '张三'
        ? { name: '李四', tel: '13900139000' }
        : { name: '张三', tel: '13800138000' },
    )
    showToast({ message: `切换为 ${contact.name}`, duration: 1500 })
  }

  return (
    <view>
      <DemoBlock title="添加联系人">
        <ContactCard type="add" onClick={handleAdd} />
      </DemoBlock>

      <DemoBlock title="编辑联系人">
        <ContactCard
          type="edit"
          name={contact.name}
          tel={contact.tel}
          onClick={handleEdit}
        />
      </DemoBlock>

      <DemoBlock title="不可编辑">
        <ContactCard
          type="edit"
          name="李四"
          tel="13900139000"
          editable={false}
        />
      </DemoBlock>

      <DemoBlock title="自定义文案">
        <ContactCard
          type="add"
          addText="添加收货地址"
          onClick={handleAdd}
        />
      </DemoBlock>
    </view>
  )
}
