import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Pricing — ZipScope',
  description: 'Free, Pro ($19/mo), and Business ($49/mo) plans for demographic reports, PDF exports, and ZIP code comparisons.',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '10 ZIP lookups per month',
      'Basic demographics: population, income, age',
      '1 comparison per day',
      'No saved reports or PDF export',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    features: [
      'Unlimited ZIP lookups',
      'Full demographic suite (6 panels)',
      'Unlimited comparisons',
      '50 saved reports',
      'PDF export with source attribution',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$49',
    period: '/month',
    features: [
      'Everything in Pro',
      'Unlimited saved reports',
      'White-label PDF export',
      'Team access (up to 5 members)',
      'CSV data export',
      'Priority data refresh',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="font-heading font-bold text-3xl text-text-primary text-center mb-3">
          Simple, transparent pricing
        </h1>
        <p className="text-text-secondary text-center mb-12 max-w-xl mx-auto">
          Start free. Upgrade when you need unlimited lookups, saved reports, and professional PDF exports.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`rounded-lg p-6 flex flex-col transition-all duration-normal hover:shadow-md hover:-translate-y-0.5 ${
                plan.highlighted
                  ? 'bg-surface border-2 border-primary shadow-sm relative'
                  : 'bg-surface border border-border'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h2 className="font-heading font-semibold text-xl text-text-primary">{plan.name}</h2>
              <div className="mt-3 mb-6">
                <span className="font-heading font-bold text-4xl text-text-primary">{plan.price}</span>
                <span className="text-text-secondary text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[15px] text-text-primary">
                    <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-md font-medium text-[15px] transition-all duration-fast active:scale-[0.98] ${
                  plan.highlighted
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'border border-border text-text-primary hover:bg-bg'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
