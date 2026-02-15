export default function HowItWorks({ steps }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">How it works</h2>
      <ol className="grid sm:grid-cols-3 gap-4">
        {steps.map((step) => (
          <li key={step.step} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center font-semibold">{step.step}</div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">{step.title}</div>
                <div className="text-sm text-gray-700">{step.description}</div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
