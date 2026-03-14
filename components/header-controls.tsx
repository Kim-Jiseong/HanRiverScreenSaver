"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ModeToggle } from "@/components/toggle-theme";

interface HeaderControlsProps {
  showBackground: boolean;
  onToggleBackground: (checked: boolean) => void;
  backgroundType: "image" | "live";
  onToggleLive: (checked: boolean) => void;
  isChatOpen: boolean;
  onToggleChat: (checked: boolean) => void;
}

export function HeaderControls({
  showBackground,
  onToggleBackground,
  backgroundType,
  onToggleLive,
  isChatOpen,
  onToggleChat,
}: HeaderControlsProps) {
  return (
    <header
      id="header"
      className="absolute top-0 flex justify-between w-full gap-2 px-4 py-3 z-50"
    >
      <div className="flex items-center space-x-2">
        <Switch
          checked={showBackground}
          onCheckedChange={onToggleBackground}
        />
        <Label>Show BG</Label>

        {showBackground && (
          <div className="flex items-center space-x-2 ml-4">
            <Switch
              checked={backgroundType === "live"}
              onCheckedChange={onToggleLive}
            />
            <Label>Live</Label>
          </div>
        )}

        <div className="flex items-center space-x-2 ml-4">
          <Switch checked={isChatOpen} onCheckedChange={onToggleChat} />
          <Label className="flex items-center gap-1">Chat</Label>
        </div>
      </div>
      <ModeToggle />
    </header>
  );
}
