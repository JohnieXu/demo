import { useCallback, useMemo, useState } from "@lynx-js/react"
import Button from "../../components/button"
import "./app.scss"

type Theme = "dark" | "light" | "auto"

declare module "@lynx-js/types" {
  interface GlobalProps {
    theme?: "Dark" | "Light"
  }
}

export function App() {
  const [theme, setTheme] = useState<Theme>()
  const appTheme = useMemo(() => lynx.__globalProps.theme?.toLowerCase(), [])
  const themeClass = useMemo(() => {
    // return "theme-dark"
    if (!theme && !appTheme) {
      return "theme-light"
    }
    return `theme-${theme || appTheme || "light"}`
  }, [theme, appTheme])
  const onToggle = useCallback(() => {
    if (!theme) {
      setTheme(appTheme === "dark" ? "light" : "dark")
    } else {
      setTheme(theme === "dark" ? "light" : "dark")
    }
    // FIXME: how to update global props? lynx.__globalProps.theme is readonly, so we can't update it directly.
  }, [theme, appTheme])

  return (
    <view className={`${themeClass} darkmode`}>
      <text className="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo dolore enim impedit, libero culpa ullam incidunt quisquam quos laboriosam cum ex hic aliquam veniam beatae nihil cupiditate nam esse assumenda!</text>
      <text className="text" style={{marginTop: '20px'}}>theme: {theme || 'undefined'} appTheme: {appTheme || 'undefined'}</text>
      <Button label="Toggle Theme" style={{marginTop: '20px'}} onClick={onToggle}></Button>
    </view>
  )
}