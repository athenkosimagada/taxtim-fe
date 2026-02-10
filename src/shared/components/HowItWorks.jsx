export default function HowItWorks({ steps }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">
        How it works
      </h2>
      <ol className="space-y-4">
        {steps.map((step) => (
          <li key={step.step} className="text-lg text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">
              {step.step}. {step.title}
            </p>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
