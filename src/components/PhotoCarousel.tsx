import React, { useRef, useState } from 'react';
import Icon from './Icon';
import { RecipePhoto } from '../types';

interface Props {
  photos: RecipePhoto[];
  altBase: string;
}

/**
 * Carrusel de fotos de la receta. Se puede navegar de tres formas:
 * arrastrando/deslizando (touch o mouse), tocando los puntos de abajo,
 * o con las flechas (visibles desde tablet/desktop).
 */
export default function PhotoCarousel({ photos, altBase }: Props) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const clamp = (i: number) => Math.max(0, Math.min(photos.length - 1, i));

  const onPointerDown = (e: React.PointerEvent) => {
    if (photos.length <= 1) return;
    setDragging(true);
    startXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - startXRef.current);
  };

  const endDrag = () => {
    if (!dragging) return;
    const width = containerRef.current?.offsetWidth || 1;
    const threshold = width * 0.16;
    if (dragX < -threshold) setIndex((i) => clamp(i + 1));
    else if (dragX > threshold) setIndex((i) => clamp(i - 1));
    setDragging(false);
    setDragX(0);
  };

  if (photos.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden bg-rose/40 border border-subtle dark:border-subtle-dark shadow-sm flex items-center justify-center">
        <Icon name="restaurant" size={44} className="text-terracota" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden bg-rose/40 border border-subtle dark:border-subtle-dark shadow-sm select-none">
      <div
        ref={containerRef}
        className="flex h-full touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        style={{
          transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
          transition: dragging ? 'none' : 'transform 0.25s ease-out',
          cursor: photos.length > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {photos.map((photo, i) => (
          <img
            key={i}
            src={`data:image/${photo.extension};base64,${photo.base64Data}`}
            alt={`${altBase} — foto ${i + 1}`}
            className="w-full h-full object-cover shrink-0"
            draggable={false}
          />
        ))}
      </div>

      {photos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => clamp(i - 1))}
            disabled={index === 0}
            aria-label="Foto anterior"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 border border-subtle items-center justify-center disabled:opacity-0 hover:bg-white transition-opacity"
          >
            <Icon name="chevron_left" size={18} className="text-oliva" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => clamp(i + 1))}
            disabled={index === photos.length - 1}
            aria-label="Foto siguiente"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 border border-subtle items-center justify-center disabled:opacity-0 hover:bg-white transition-opacity"
          >
            <Icon name="chevron_right" size={18} className="text-oliva" />
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ backgroundColor: i === index ? '#C17C53' : 'rgba(255,255,255,0.75)' }}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
