import { InstituteHeader } from "@/components/institute/InstituteHeader";
import { InstituteFooter } from "@/components/institute/InstituteFooter";

export const metadata = {
  title: {
    template: "%s | Stratosphere Institute",
    default: "Stratosphere Institute | Strategic Policy Research",
  },
};

export default function InstituteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-institute-bg text-institute-text font-serif">
      <InstituteHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <InstituteFooter />
    </div>
  );
}
