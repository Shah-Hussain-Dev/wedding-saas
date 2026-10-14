import { redirect } from "next/navigation";

interface TemplateRedirectProps {
  params: Promise<{ templateId: string }>;
}

export default async function TemplateRedirectPage({ params }: TemplateRedirectProps) {
  const { templateId } = await params;
  redirect(`/preview/${templateId}`);
}
