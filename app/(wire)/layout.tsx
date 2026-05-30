import WireHeader from "@/components/wire/WireHeader";
import { WireFooter } from "@/components/wire/WireFooter";

export const metadata = {
  title: {
    template: "%s | Stratosphere Wire",
    default: "Stratosphere Wire | Daily Geopolitical Intelligence",
  },
};

export default function WireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-wire-bg text-wire-text">
      <WireHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <WireFooter />
    </div>
  );
}
