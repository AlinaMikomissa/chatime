"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TimerArea } from "@/components/TimerArea";
import { DetailsPanel } from "@/components/DetailsPanel";
import { DEFAULT_TEAS } from "@/data/default-teas";
import { useBrewingSession } from "@/hooks/useBrewingSession";

export default function Home() {
  const [selectedTeaId, setSelectedTeaId] = useState(DEFAULT_TEAS[2].id); // Dà Hóng Páo
  const selectedTea = DEFAULT_TEAS.find((t) => t.id === selectedTeaId) ?? DEFAULT_TEAS[0];
  const [sessionState, actions] = useBrewingSession(selectedTea);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        teas={DEFAULT_TEAS}
        selectedTeaId={selectedTeaId}
        onSelectTea={setSelectedTeaId}
      />
      <TimerArea
        tea={selectedTea}
        sessionState={sessionState}
        actions={actions}
      />
      <DetailsPanel
        tea={selectedTea}
        sessionState={sessionState}
      />
    </div>
  );
}
