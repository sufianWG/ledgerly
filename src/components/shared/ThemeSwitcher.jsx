"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeSwitcher() {
    const { resolvedTheme, setTheme } = useTheme();

    if (!resolvedTheme) {
        return null;
    }

    const isDark = resolvedTheme === "dark";
    const handleThemeChange = (isSelected) => {
        setTheme(isSelected ? "dark" : "light")
    }

    return (
        <Switch
            size="md"
            isSelected={isDark}
            onChange={handleThemeChange}
        >
            <Switch.Content>
                <Switch.Control>
                    <Switch.Thumb>
                        <Switch.Icon>
                            {isDark ? <FaMoon size={14} ></FaMoon> : <FaSun size={14} ></FaSun>}
                        </Switch.Icon>
                    </Switch.Thumb>
                </Switch.Control>
            </Switch.Content>
        </Switch>
    );
}
