import { Container } from "@/components/ui/Container";
import { NiacinSubNav } from "@/components/niacin/NiacinSubNav";

export default function NiacinLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-slate-200 bg-mist">
        <Container className="py-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-medical">
            Niacin Resource Center
          </p>
          <div className="mt-4">
            <NiacinSubNav />
          </div>
        </Container>
      </div>
      {children}
    </div>
  );
}
