export default function InfoCard({ title, items }) {
  return (
    <section className="mb-12 bg-gray-50 border border-gray-200 rounded-2xl p-8">
      <h2 className="text-3xl font-semibold mb-4 text-gray-900">{title}</h2>
      <ul className="text-lg text-gray-700 space-y-2 list-disc list-inside">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
