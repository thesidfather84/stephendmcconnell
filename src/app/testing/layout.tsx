import { Container } from "@/components/ui/Container";
import { TestingSubNav } from "@/components/testing/TestingSubNav";

export default function TestingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-slate-200 bg-mist">
        <Container className="py-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-medical">
            Testing &amp; Self-Assessment
          </p>
          <div className="mt-4">
            <TestingSubNav />
          </div>
        </Container>
      </div>
      {children}
    </div>
  );
}
