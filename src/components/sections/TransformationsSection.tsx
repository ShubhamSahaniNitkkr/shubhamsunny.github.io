import media from '../../data/media.json';
import type { Transformation } from '../../types';
import BeforeAfterSlider from '../ui/BeforeAfterSlider';
import { getWhatsAppUrl } from '../../lib/utils';

const items = media.transformations as Transformation[];

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
            {item.packageUsed && (
              <p className="mt-3 text-xs tracking-widest text-ivory/50 uppercase">Package: {item.packageUsed}</p>
            )}
            <a
              href={getWhatsAppUrl(`Hi Shubham, I saw the ${item.clientName} transformation. I'd like something similar for my business.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-rose mt-8 inline-flex text-[10px]"
            >
              Get Similar Results
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
