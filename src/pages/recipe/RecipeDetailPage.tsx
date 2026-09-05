import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichText from '../../components/RichText';
import IconButton from '../../components/IconButton';
import PrimaryButton from '../../components/PrimaryButton';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import PhotoCarousel from '../../components/PhotoCarousel';
import { recipesApi } from '../../api/recipes';
import { useRecipesStore } from '../../store/recipesStore';
import { useAuthStore } from '../../store/authStore';
import { Recipe } from '../../types';
import { sanitizeFileName } from '../../utils/richText';

export default function RecipeDetailPage() {
  const navigate = useNavigate();
  const { recipeId = '' } = useParams();

  const cached = useRecipesStore((s) => s.recipes.find((r) => r.id === recipeId));
  const upsertLocal = useRecipesStore((s) => s.upsertLocal);
  const removeLocal = useRecipesStore((s) => s.removeLocal);
  const user = useAuthStore((s) => s.user);

  const [recipe, setRecipe] = useState<Recipe | undefined>(cached);
  const [servings, setServings] = useState(cached?.servings ?? 4);
  const [exporting, setExporting] = useState(false);

  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    recipesApi
      .getOne(recipeId)
      .then(({ data }) => {
        setRecipe(data);
        setServings(data.servings);
        upsertLocal(data);
      })
      .catch(() => {
        // sin conexión: se queda con la versión cacheada
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const scaleFactor = recipe ? servings / recipe.servings : 1;
  const isOwner = recipe && user && recipe.ownerId === user.userId;

  const sortedIngredients = useMemo(
    () => [...(recipe?.ingredients ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [recipe],
  );
  const sortedSteps = useMemo(
    () => [...(recipe?.steps ?? [])].sort((a, b) => a.order - b.order),
    [recipe],
  );

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-oliva dark:text-cream font-sans">Cargando receta…</p>
      </div>
    );
  }

  const handleDisable = async () => {
    setDisabling(true);
    try {
      await recipesApi.disable(recipe.id);
      removeLocal(recipe.id);
      navigate(-1);
    } finally {
      setDisabling(false);
    }
  };

  const handleShare = async () => {
    setShareError(null);
    setCopied(false);
    setShareModalOpen(true);
    try {
      const { data } = await recipesApi.createShareLink(recipe.id);
      setShareLink(`${window.location.origin}/compartida/${data.shareToken}`);
    } catch {
      setShareError('No se pudo generar el enlace. Intentá de nuevo.');
    }
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPdf = async () => {
    if (exporting) return;
    setExporting(true);
    setPdfError(null);
    try {
      const response = await recipesApi.exportPdf(recipe.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sanitizeFileName(recipe.name)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setPdfError('No se pudo generar el PDF. Revisá tu conexión e intentá de nuevo.');
      setTimeout(() => setPdfError(null), 4000);
    } finally {
      setExporting(false);
    }
  };

  const formatQty = (qty: number) =>
    qty.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');

  return (
    <div className="min-h-screen pb-16">
      {/* Barra superior: solo el botón de volver, en flujo normal (no flotante) */}
      <div className="flex items-center px-5 md:px-8 pt-4 pb-1 max-w-3xl mx-auto">
        <IconButton icon="arrow_back" variant="circle" label="Volver" onClick={() => navigate(-1)} />
      </div>

      <div className="px-5 md:px-8 max-w-3xl mx-auto">
        {/* Imagen contenida, con swipe/drag para pasar de foto (además de los puntos y flechas) */}
        <PhotoCarousel photos={recipe.photos ?? []} altBase={recipe.name} />

        <div className="pt-5">
          {recipe.category ? (
            <span className="inline-flex items-center bg-oliva px-2.5 py-1 rounded-lg mb-2">
              <span className="text-white font-sans-bold text-[9.5px] uppercase leading-none">
                {recipe.category.name}
              </span>
            </span>
          ) : null}
          <h1 className="font-serif-bold text-[24px] text-oliva dark:text-cream">{recipe.name}</h1>
          {recipe.description ? (
            <p className="font-sans text-[13px] text-muted dark:text-muted-dark mt-2">{recipe.description}</p>
          ) : null}

          <div className="flex mt-3 gap-4 flex-wrap">
            {recipe.prepTimeMinutes ? (
              <span className="flex items-center gap-1 text-[11px] text-muted dark:text-muted-dark font-sans-medium">
                <Icon name="schedule" size={14} /> Prep {recipe.prepTimeMinutes} min
              </span>
            ) : null}
            {recipe.cookTimeMinutes ? (
              <span className="flex items-center gap-1 text-[11px] text-muted dark:text-muted-dark font-sans-medium">
                <Icon name="local_fire_department" size={14} /> Cocción {recipe.cookTimeMinutes} min
              </span>
            ) : null}
          </div>

          {recipe.videoUrl ? (
            <a
              href={recipe.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-[11.5px] font-sans-bold text-terracota underline"
            >
              <Icon name="smart_display" size={15} /> Ver video de la receta
            </a>
          ) : null}

          {/* Barra de acciones — fácil de encontrar, arriba de todo. Editar y
              deshabilitar son ícono solo (se entienden sin texto); compartir
              y exportar llevan etiqueta porque son menos evidentes. */}
          <div className="flex items-center flex-wrap gap-2 mt-4">
            {isOwner ? (
              <IconButton
                icon="edit"
                variant="circle"
                label="Editar receta"
                onClick={() => navigate(`/recetas/${recipe.id}/editar`)}
                circleBg="transparent"
              />
            ) : null}

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-white dark:bg-oliva-900 border border-subtle dark:border-subtle-dark rounded-full px-3.5 py-2 hover:opacity-70"
            >
              <Icon name="ios_share" size={15} className="text-oliva dark:text-cream" />
              <span className="text-oliva dark:text-cream font-sans-bold text-[12px]">Compartir</span>
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={exporting}
              className="flex items-center gap-1.5 bg-white dark:bg-oliva-900 border border-subtle dark:border-subtle-dark rounded-full px-3.5 py-2 hover:opacity-70 disabled:opacity-60"
            >
              <Icon name={exporting ? 'hourglass_top' : 'picture_as_pdf'} size={15} className="text-oliva dark:text-cream" />
              <span className="text-oliva dark:text-cream font-sans-bold text-[12px]">
                {exporting ? 'Generando…' : 'Exportar PDF'}
              </span>
            </button>

            {isOwner ? (
              <IconButton
                icon="delete_outline"
                variant="circle"
                tone="danger"
                label="Deshabilitar receta"
                onClick={() => setDisableModalOpen(true)}
                circleBg="transparent"
                className="ml-auto"
              />
            ) : null}
          </div>
          {pdfError ? <p className="text-danger text-[11px] font-sans-medium mt-2">{pdfError}</p> : null}

          {/* CTA de modo cocina — en flujo normal (no flotante), justo acá
              arriba porque quien ya conoce la receta quiere ir directo. */}
          <button
            type="button"
            onClick={() => navigate(`/recetas/${recipe.id}/cocinar`)}
            className="w-full bg-terracota border border-black/5 rounded-2xl py-3.5 flex items-center justify-center gap-2 shadow-md hover:brightness-105 mt-4"
          >
            <Icon name="play_circle" size={18} filled className="text-white" />
            <span className="text-white font-sans-bold text-[13px]">Iniciar modo cocina</span>
          </button>

          <div className="flex items-center bg-white dark:bg-oliva-900 border border-subtle dark:border-subtle-dark rounded-2xl px-3.5 py-2 w-fit mt-4">
            <button
              type="button"
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="w-6 h-6 rounded-full bg-cream dark:bg-oliva-dark flex items-center justify-center hover:opacity-70"
            >
              <Icon name="remove" size={14} className="text-terracota" />
            </button>
            <span className="font-sans-bold text-[12px] text-oliva dark:text-cream mx-3 tabular-nums">
              {servings} porciones
            </span>
            <button
              type="button"
              onClick={() => setServings((s) => s + 1)}
              className="w-6 h-6 rounded-full bg-cream dark:bg-oliva-dark flex items-center justify-center hover:opacity-70"
            >
              <Icon name="add" size={14} className="text-terracota" />
            </button>
          </div>

          <h2 className="font-serif-bold text-[15px] text-oliva dark:text-cream mt-6 mb-2">Ingredientes</h2>
          {sortedIngredients.map((ing, idx) => {
            const scaledQty = formatQty(ing.quantity * scaleFactor);
            return (
              <div
                key={ing.id ?? idx}
                className="flex justify-between py-2 border-b border-dashed border-oliva/15"
              >
                <p className="text-[12.5px] text-oliva dark:text-cream font-sans flex-1">
                  <span className="font-sans-bold">
                    {scaledQty} {ing.measure?.abbreviation}{' '}
                  </span>
                  {ing.ingredient?.name ?? ing.freeTextName}
                  {ing.allergens?.length ? '  ' + ing.allergens.map((a) => a.emoji).join(' ') : ''}
                </p>
              </div>
            );
          })}

          <h2 className="font-serif-bold text-[15px] text-oliva dark:text-cream mt-6 mb-2">Preparación</h2>
          {sortedSteps.map((step, idx) => (
            <div key={step.id ?? idx} className="flex mb-3.5">
              <div className="w-5 h-5 rounded-full bg-terracota flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
                <span className="text-white text-[10px] font-sans-bold">{idx + 1}</span>
              </div>
              <div className="flex-1">
                <RichText content={step.content} className="text-[12.5px] text-oliva dark:text-cream font-sans" />
                {step.timerSeconds ? (
                  <p className="flex items-center gap-1 text-[10.5px] text-terracota font-sans-bold mt-1">
                    <Icon name="timer" size={12} /> {Math.round(step.timerSeconds / 60)} min
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {exporting ? (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center z-40"
          style={{ backgroundColor: 'rgba(232,228,218,0.94)' }}
        >
          <span
            className="w-10 h-10 rounded-full border-4 border-oliva border-t-transparent animate-spin"
            aria-hidden
          />
          <p className="font-serif-bold text-[15px] text-oliva mt-4">Generando PDF…</p>
          <p className="font-sans text-[11.5px] text-muted mt-1">Preparando tu receta</p>
        </div>
      ) : null}

      {/* Modal de confirmación para deshabilitar */}
      <Modal open={disableModalOpen} onClose={() => setDisableModalOpen(false)} title="¿Deshabilitar receta?">
        <p className="font-sans text-[13px] text-oliva dark:text-cream mb-5">
          "{recipe.name}" dejará de verse en tu listado y en búsquedas. Podés volver a habilitarla más adelante
          escribiéndonos, no se borra permanentemente.
        </p>
        <div className="flex gap-3">
          <div className="flex-1">
            <PrimaryButton label="Cancelar" variant="outline" onClick={() => setDisableModalOpen(false)} />
          </div>
          <div className="flex-1">
            <PrimaryButton
              label="Deshabilitar"
              variant="danger"
              icon="delete_outline"
              loading={disabling}
              onClick={handleDisable}
            />
          </div>
        </div>
      </Modal>

      {/* Modal para compartir: muestra el enlace generado con botón de copiar */}
      <Modal open={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Compartir receta">
        {shareError ? (
          <p className="text-danger text-[13px] font-sans-medium">{shareError}</p>
        ) : !shareLink ? (
          <p className="font-sans text-[13px] text-muted">Generando enlace…</p>
        ) : (
          <>
            <p className="font-sans text-[12.5px] text-muted mb-3">
              Cualquiera con este enlace puede ver la receta, sin necesidad de iniciar sesión.
            </p>
            <div className="flex items-center gap-2 bg-cream dark:bg-oliva-dark rounded-xl px-3 py-2.5 mb-4 border border-subtle dark:border-subtle-dark">
              <Icon name="link" size={16} className="text-muted shrink-0" />
              <p className="flex-1 text-[12px] text-oliva dark:text-cream font-sans truncate">{shareLink}</p>
            </div>
            <PrimaryButton
              label={copied ? '¡Copiado!' : 'Copiar enlace'}
              icon={copied ? 'check' : 'content_copy'}
              onClick={handleCopyLink}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
