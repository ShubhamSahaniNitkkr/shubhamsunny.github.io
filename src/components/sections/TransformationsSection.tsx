import media from '../../data/media.json';
import type { Transformation } from '../../types';
import BeforeAfterSlider from '../ui/BeforeAfterSlider';
import { getConsultationEmailUrl } from '../../lib/utils';

const items = media.transformations as Transformation[];

const clientBenefits: Record<string, string[]> = {
  'transform-1': [
    '40% more online appointment bookings',
    'Mobile traffic increased 65%',
    'Page load time cut from 8s to under 2s',
    'Patients now trust the brand before visiting',
  ],
  'transform-2': [
    'Phone orders up 48% within the first month',
    'Menu pages load instantly on mobile',
    'Google Maps clicks doubled',
    'Clear hours & location reduced support calls',
  ],
  'transform-3': [
    'Consultation form submissions up 33%',
    'Bounce rate dropped by 42%',
    'Premium look matched their reputation',
    'Practice areas clearly organized for clients',
  ],
};

export default function TransformationsSection() {
  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-ivory/60">
        Add before/after images in public/media/transformations/ and update Excel.
      </p>
    );
  }

  return (
    <div className="space-y-14 sm:space-y-20">
      {items.map((item) => (
        <div key={item.id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <BeforeAfterSlider
            before={item.before}
            after={item.after}
            beforeType={item.beforeType}
            afterType={item.afterType}
            alt={item.clientName}
          />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-rose-gold-light uppercase">{item.industry}</p>
            <h3 className="font-display mt-3 text-3xl font-semibold text-ivory sm:text-4xl">{item.clientName}</h3>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70 sm:text-base">&ldquo;{item.story}&rdquo;</p>
            {clientBenefits[item.id] && (
              <div className="mt-5">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-rose-gold-light uppercase">Client results</p>
                <ul className="mt-3 space-y-2">
                  {clientBenefits[item.id].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-ivory/80">
                      <span className="mt-1 text-rose-gold">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {item.packageUsed && (
              <p className="mt-4 text-xs tracking-widest text-ivory/50 uppercase">Package: {item.packageUsed}</p>
            )}
            <a
              href={getConsultationEmailUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-rose mt-8 inline-flex text-[10px]"
            >
              Start Your Transformation
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
