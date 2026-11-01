"use client";

import { use, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlassNav } from "@/components/ui/glass-nav";
import { TemplateAdminEditor } from "@/components/admin/TemplateAdminEditor";
import { isUserAdmin } from "@/lib/admin-client";

interface PageProps {
  params: Promise<{ templateId: string }>;
}

export default function AdminTemplateSettingsPage({ params }: PageProps) {
  const { templateId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const authorized = isUserAdmin(session?.user?.email);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/admin/templates/${templateId}`);
    }
  }, [status, router, templateId]);

  if (status === "loading" || !authorized) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#FAFAF8] font-sans text-sm text-[#76766F]">
        Checking admin access…
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAFAF8]">
      <GlassNav />
      <main className="min-h-0 flex-1 overflow-hidden">
        <TemplateAdminEditor templateId={templateId} />
      </main>
    </div>
  );
}
