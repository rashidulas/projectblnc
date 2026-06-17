export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100 pt-11 sm:pt-12">
      {children}
    </div>
  );
}