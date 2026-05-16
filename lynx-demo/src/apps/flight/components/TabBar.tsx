import { clsx } from "clsx"
import IconBooking from "@assets/flight/svg/query/booking.svg"
import IconOrder from "@assets/flight/svg/query/order.svg"
import "./TabBar.scss"

export interface TabBarProps {
  activeTab?: "booking" | "order"
  onTabChange?: (tab: "booking" | "order") => void
}

export function TabBar({ activeTab = "booking", onTabChange }: TabBarProps) {
  const handleTabChange = (tab: "booking" | "order") => {
    onTabChange?.(tab)
  }

  return (
    <view className="bottom-tab-bar">
      <view className="bottom-content">
        <view className={clsx("bottom-tab", activeTab === "booking" && "active")} bindtap={() => handleTabChange("booking")}>
          <svg className="bottom-tab-icon bottom-icon-booking" src={IconBooking} />
          <text className={clsx("bottom-tab-label booking-label", activeTab === "booking" && "active")}>预订</text>
        </view>
        <view className={clsx("bottom-tab", activeTab === "order" && "active")} bindtap={() => handleTabChange("order")}>
          <svg className="bottom-tab-icon bottom-icon-order" src={IconOrder} />
          <text className={clsx("bottom-tab-label order-label", activeTab === "order" && "active")}>订单</text>
        </view>
      </view>
    </view>
  )
}
