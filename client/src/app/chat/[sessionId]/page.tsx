import AppRender from "../app-render";

interface SessionChatPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionChatPage({
  params,
}: SessionChatPageProps) {
  const { sessionId } = await params;

  return (
    <div className="w-full h-full">
      <AppRender sessionId={sessionId} />
    </div>
  );
}
