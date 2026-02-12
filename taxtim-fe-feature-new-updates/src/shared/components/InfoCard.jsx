export default function InfoCard({ title, items }) {
  return (
    <section className="mb-12 card">
      <h2 className="text-3xl font-semibold mb-4 text-gray-900">{title}</h2>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-primary font-bold mt-1">✓</span>
            <span className="text-lg text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
