export default function AnalyticsPage() {
  const stats = [
    { label: "Total Resumes", value: 12 },
    { label: "Downloads", value: 25 },
    { label: "AI Generations", value: 48 },
    { label: "ATS Score Avg", value: "82%" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-slate-500">
          Track your resume performance and activity.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-slate-900 border rounded-xl p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Usage Overview</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Resume Downloads</span>
              <span>25 / Unlimited</span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full mt-1">
              <div className="w-1/3 h-3 bg-blue-600 rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span>AI Usage</span>
              <span>48 Requests</span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full mt-1">
              <div className="w-2/3 h-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}