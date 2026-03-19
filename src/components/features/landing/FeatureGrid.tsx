const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: '15-Second Reports',
    description: 'Enter a ZIP, get a full demographic breakdown instantly. Population, income, age, education, housing, and employment — all in one view.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: 'Compare ZIPs Side-by-Side',
    description: 'Put two ZIP codes next to each other with color-coded difference badges. Make location decisions obvious in 10 seconds.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    title: 'Export Professional PDFs',
    description: 'One-click PDF export with key stats, mini charts, and Census source attribution. Drop it straight into a client email or listing package.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-16 px-4 border-t border-border">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 stagger-grid">
        {features.map(f => (
          <div key={f.title} className="text-center bg-surface rounded-lg p-6 transition-all duration-normal hover:shadow-md hover:-translate-y-0.5">
            <div className="flex justify-center mb-4">{f.icon}</div>
            <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">{f.title}</h3>
            <p className="text-text-secondary text-[15px] leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
