"use client";

import type { ReactNode, RefObject } from "react";

interface TemplateEditorSidebarShellProps {
  sidebar: ReactNode;
  preview: ReactNode;
  /** Show live preview column (desktop). Default true. */
  showPreview?: boolean;
  sidebarRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Shared customize / admin editor layout: scrollable sidebar + live preview column.
 */
export function TemplateEditorSidebarShell({
  sidebar,
  preview,
  showPreview = true,
  sidebarRef,
}: TemplateEditorSidebarShellProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col lg:grid lg:h-[100dvh] lg:max-h-[100dvh] lg:grid-cols-[minmax(min(100%,320px),26rem)_minmax(0,1fr)] lg:overflow-hidden lg:items-stretch">
      <aside
        ref={sidebarRef}
        data-lenis-prevent
        data-lenis-prevent-wheel
        className="customizer-sidebar-scroll flex min-h-0 w-full min-w-0 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#FAFAF8] lg:max-h-[100dvh] lg:min-h-0 lg:border-r lg:border-[#073D31]/10 lg:h-[100dvh]"
      >
        {sidebar}
      </aside>

      {showPreview ? (
        <aside className="hidden lg:flex lg:min-h-0 lg:h-full lg:max-h-full lg:flex-col lg:overflow-hidden">
          {preview}
        </aside>
      ) : null}
    </div>
  );
}
