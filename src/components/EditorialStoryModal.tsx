import React from 'react';
import { X, BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';
import { EditorialStory, Product } from '../types';

interface EditorialStoryModalProps {
  story: EditorialStory | null;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const EditorialStoryModal: React.FC<EditorialStoryModalProps> = ({
  story,
  onClose,
  products,
  onSelectProduct
}) => {
  if (!story) return null;

  const featuredProducts = products.filter((p) => story.featuredProductIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative bg-[#fdfbf7] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#1a1a1a]/20 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-[#fdfbf7] hover:bg-[#1a1a1a] text-[#1a1a1a] hover:text-[#fdfbf7] rounded-full transition-colors border border-[#1a1a1a]/20 shadow-sm"
          aria-label="Close story"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Hero Image */}
        <div className="relative h-64 sm:h-96 w-full bg-[#1a1a1a] overflow-hidden">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-black/20" />

          <div className="absolute bottom-6 left-6 right-6 text-white max-w-2xl">
            <div className="inline-flex items-center gap-2 ui-mono text-xs font-bold text-[#fdfbf7] mb-2 bg-[#8b4513] px-3 py-1 rounded">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Vol. 26 Journal Issue</span>
            </div>
            <h1 className="serif-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-[#fdfbf7]">
              {story.title}
            </h1>
          </div>
        </div>

        {/* Article Meta & Content */}
        <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6 text-[#1a1a1a]">
          {/* Byline */}
          <div className="flex flex-wrap items-center justify-between ui-mono text-xs text-[#5a5853] border-b border-[#1a1a1a]/15 pb-4">
            <span className="font-bold text-[#1a1a1a]">{story.author}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#8b4513]" /> {story.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#8b4513]" /> {story.readTime}
              </span>
            </div>
          </div>

          {/* Subtitle / Excerpt */}
          <p className="serif-display italic text-xl text-[#1a1a1a] border-l-2 border-[#8b4513] pl-4 py-1 leading-relaxed">
            &quot;{story.excerpt}&quot;
          </p>

          {/* Paragraphs */}
          <div className="space-y-4 text-sm leading-relaxed text-[#1a1a1a] font-normal">
            {story.contentParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Featured Garments from Article */}
          {featuredProducts.length > 0 && (
            <div className="mt-10 pt-8 border-t border-[#1a1a1a]/15">
              <h3 className="ui-mono text-xs font-bold text-[#8b4513] mb-4">
                Shop Garments Featured In This Editorial:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {featuredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="bg-[#f7f4ee] p-3 rounded-lg border border-[#1a1a1a]/15 hover:border-[#8b4513] cursor-pointer transition-all flex flex-col justify-between group shadow-2xs"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full aspect-[4/5] object-cover rounded bg-[#f5f2eb] mb-2"
                    />
                    <div>
                      <p className="serif-display text-sm font-bold text-[#1a1a1a] group-hover:text-[#8b4513] truncate">
                        {p.name}
                      </p>
                      <p className="ui-mono text-xs font-bold text-[#8b4513] mt-0.5">${p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
