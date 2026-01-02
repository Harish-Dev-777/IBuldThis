import Navbar from "@/components/web/navbar";

export const dynamic = "force-dynamic";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
