"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function ModeToggle({ size = "icon" }) {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const isDark = (resolvedTheme || theme) === "dark"

    if (!mounted) {
        return (
            <Button variant="ghost" size={size} aria-label="Toggle theme" className="h-8 w-8" />
        )
    }

    return (
        <Button
            variant="ghost"
            size={size}
            aria-label="Toggle theme"
            className="h-9 w-9"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
    )
}


