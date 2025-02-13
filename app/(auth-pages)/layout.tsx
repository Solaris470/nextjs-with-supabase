export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w flex flex-col gap-12 items-start bg-blue-500">
      <div className="flex justify-center items-center h-screen max-w mx-auto">
        {children}
      </div>
    </div>
  );
}
