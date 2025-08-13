import { CountdownExamples } from '@/components/examples/countdown-examples';

export default function CountdownPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto py-12">
        <CountdownExamples />
      </div>
    </div>
  );
}
