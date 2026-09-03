import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/Icon';
import TextField from '../../components/TextField';
import ScreenHeader from '../../components/ScreenHeader';
import PrimaryButton from '../../components/PrimaryButton';
import Chip from '../../components/Chip';
import IngredientFormRow, { IngredientRowValue } from '../../components/IngredientFormRow';
import StepFormRow, { StepRowValue } from '../../components/StepFormRow';
import { categoriesApi, ingredientsApi, measuresApi, allergensApi } from '../../api/catalog';
import { recipesApi } from '../../api/recipes';
import { fileToPhoto } from '../../utils/imagePicker';
import { useRecipesStore } from '../../store/recipesStore';
import { Category, Ingredient, Measure, Allergen, RecipePhoto } from '../../types';
import { recipeFormSchema, ingredientRowSchema, stepRowSchema, validateForm } from '../../validation/schemas';

const emptyIngredient: IngredientRowValue = { quantity: '', allergenIds: [] };
const emptyStep: StepRowValue = { content: '', timerSeconds: '' };

export default function RecipeFormPage() {
  const navigate = useNavigate();
  const { recipeId: editingId } = useParams();
  const upsertLocal = useRecipesStore((s) => s.upsertLocal);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredientsCatalog, setIngredientsCatalog] = useState<Ingredient[]>([]);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('');
  const [cookTimeMinutes, setCookTimeMinutes] = useState('');
  const [servings, setServings] = useState('4');
  const [videoUrl, setVideoUrl] = useState('');
  const [photos, setPhotos] = useState<RecipePhoto[]>([]);
  const [ingredients, setIngredients] = useState<IngredientRowValue[]>([{ ...emptyIngredient }]);
  const [steps, setSteps] = useState<StepRowValue[]>([{ ...emptyStep }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ingredientErrors, setIngredientErrors] = useState<Record<number, string>>({});
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      categoriesApi.listEnabled(),
      ingredientsApi.listEnabled(),
      measuresApi.listEnabled(),
      allergensApi.listEnabled(),
    ]).then(([c, i, m, a]) => {
      setCategories(c.data);
      setIngredientsCatalog(i.data);
      setMeasures(m.data);
      setAllergens(a.data);
    });
  }, []);

  useEffect(() => {
    if (!editingId) return;
    recipesApi.getOne(editingId).then(({ data }) => {
      setName(data.name);
      setDescription(data.description ?? '');
      setCategoryId(data.categoryId);
      setPrepTimeMinutes(data.prepTimeMinutes ? String(data.prepTimeMinutes) : '');
      setCookTimeMinutes(data.cookTimeMinutes ? String(data.cookTimeMinutes) : '');
      setServings(String(data.servings));
      setVideoUrl(data.videoUrl ?? '');
      setPhotos(data.photos ?? []);
      setIngredients(
        data.ingredients.length
          ? data.ingredients.map((ing) => ({
              ingredientId: ing.ingredientId,
              freeTextName: ing.freeTextName,
              quantity: String(ing.quantity),
              measureId: ing.measureId,
              allergenIds: ing.allergens?.map((a) => a.id) ?? [],
            }))
          : [{ ...emptyIngredient }],
      );
      setSteps(
        data.steps.length
          ? data.steps.map((s) => ({
              content: s.content,
              timerSeconds: s.timerSeconds ? String(s.timerSeconds) : '',
            }))
          : [{ ...emptyStep }],
      );
    });
  }, [editingId]);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setPhotoError(null);
    const files = Array.from(fileList);
    for (const file of files) {
      if (photos.length >= 5) {
        setPhotoError('Máximo 5 fotos por receta');
        break;
      }
      try {
        const photo = await fileToPhoto(file);
        setPhotos((prev) => [...prev, photo]);
      } catch (err) {
        setPhotoError((err as Error).message);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const formErrors = await validateForm(recipeFormSchema, {
      name,
      servings,
      prepTimeMinutes,
      cookTimeMinutes,
      videoUrl,
    });
    setErrors(formErrors ?? {});
    if (formErrors) {
      setSubmitError('Revisa los datos, hay campos con errores más arriba.');
      return;
    }
    if (!categoryId) {
      setSubmitError('Elige una categoría para la receta.');
      return;
    }

    const validIngredients = ingredients.filter(
      (i) => (i.ingredientId || i.freeTextName) && i.measureId && i.quantity,
    );
    if (validIngredients.length === 0) {
      setSubmitError('Agrega al menos un ingrediente completo (nombre, cantidad y medida).');
      return;
    }
    const newIngredientErrors: Record<number, string> = {};
    for (let i = 0; i < ingredients.length; i++) {
      if (!ingredients[i].quantity) continue;
      const rowErrors = await validateForm(ingredientRowSchema, { quantity: ingredients[i].quantity });
      if (rowErrors?.quantity) newIngredientErrors[i] = rowErrors.quantity;
    }
    setIngredientErrors(newIngredientErrors);
    if (Object.keys(newIngredientErrors).length > 0) {
      setSubmitError('Revisa las cantidades: alguna cantidad de ingrediente es inválida.');
      return;
    }

    const validSteps = steps.filter((s) => s.content.trim());
    if (validSteps.length === 0) {
      setSubmitError('Agrega al menos un paso de preparación.');
      return;
    }
    const newStepErrors: Record<number, string> = {};
    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].content.trim()) continue;
      const rowErrors = await validateForm(stepRowSchema, { content: steps[i].content });
      if (rowErrors?.content) newStepErrors[i] = rowErrors.content;
    }
    setStepErrors(newStepErrors);
    if (Object.keys(newStepErrors).length > 0) {
      setSubmitError('Revisa los pasos: alguno de preparación es inválido.');
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      categoryId,
      prepTimeMinutes: prepTimeMinutes ? Number(prepTimeMinutes) : undefined,
      cookTimeMinutes: cookTimeMinutes ? Number(cookTimeMinutes) : undefined,
      servings: Number(servings) || 4,
      videoUrl: videoUrl.trim() || undefined,
      photos: photos.map((p, idx) => ({ ...p, order: idx })),
      ingredients: validIngredients.map((ing, idx) => ({
        ingredientId: ing.ingredientId,
        freeTextName: ing.ingredientId ? undefined : ing.freeTextName,
        quantity: Number(ing.quantity),
        measureId: ing.measureId as string,
        allergenIds: ing.allergenIds,
        order: idx,
      })),
      steps: validSteps.map((s, idx) => ({
        content: s.content,
        timerSeconds: s.timerSeconds ? Number(s.timerSeconds) : undefined,
        order: idx,
      })),
    };

    try {
      const { data } = editingId
        ? await recipesApi.update(editingId, payload)
        : await recipesApi.create(payload);
      upsertLocal(data);
      navigate(`/recetas/${data.id}`, { replace: true });
    } catch {
      setSubmitError('No se pudo guardar la receta. Revisa los datos e intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <ScreenHeader
        title={editingId ? 'Editar receta' : 'Nueva receta'}
        sideWidth={72}
        left={
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-oliva dark:text-cream text-[13px] font-sans-bold"
          >
            Cancelar
          </button>
        }
        right={
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="text-terracota text-[13px] font-sans-bold"
          >
            {saving ? '...' : 'Guardar'}
          </button>
        }
      />

      <div className="px-5 max-w-2xl mx-auto">
        <TextField label="Nombre de la receta" value={name} onChangeText={setName} error={errors.name} />
        <TextField label="Descripción" multiline value={description} onChangeText={setDescription} />

        <p className="font-sans-medium text-[12px] text-oliva dark:text-cream mb-1.5">Categoría</p>
        <div className="flex overflow-x-auto mb-4 pb-1">
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} active={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
          ))}
        </div>

        <div className="flex gap-2.5">
          <div className="flex-1">
            <TextField
              label="Prep (min)"
              type="text"
              inputMode="numeric"
              value={prepTimeMinutes}
              onChangeText={setPrepTimeMinutes}
              error={errors.prepTimeMinutes}
            />
          </div>
          <div className="flex-1">
            <TextField
              label="Cocción (min)"
              type="text"
              inputMode="numeric"
              value={cookTimeMinutes}
              onChangeText={setCookTimeMinutes}
              error={errors.cookTimeMinutes}
            />
          </div>
          <div className="flex-1">
            <TextField
              label="Porciones"
              type="text"
              inputMode="numeric"
              value={servings}
              onChangeText={setServings}
              error={errors.servings}
            />
          </div>
        </div>

        <TextField
          label="Video (enlace, opcional)"
          type="url"
          value={videoUrl}
          onChangeText={setVideoUrl}
          error={errors.videoUrl}
        />

        <p className="font-sans-medium text-[12px] text-oliva dark:text-cream mb-1.5 mt-1">
          Fotos ({photos.length}/5)
        </p>
        <div className="flex overflow-x-auto mb-2 pb-1 gap-2.5">
          {photos.map((p, idx) => (
            <div key={idx} className="relative shrink-0">
              <img
                src={`data:image/${p.extension};base64,${p.base64Data}`}
                alt=""
                style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-terracota flex items-center justify-center"
              >
                <Icon name="close" size={11} className="text-white" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-[72px] h-[72px] shrink-0 rounded-2xl bg-white dark:bg-oliva-900 border border-subtle dark:border-subtle-dark flex items-center justify-center hover:opacity-70"
          >
            <Icon name="add_a_photo" size={22} className="text-terracota" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
        </div>
        {photoError ? <p className="text-red-600 text-[10.5px] font-sans-medium mb-4">{photoError}</p> : null}

        <h2 className="font-serif-bold text-[15px] text-oliva dark:text-cream mb-2 mt-4">Ingredientes</h2>
        {ingredients.map((ing, idx) => (
          <IngredientFormRow
            key={idx}
            value={ing}
            onChange={(v) => setIngredients((prev) => prev.map((p, i) => (i === idx ? v : p)))}
            onRemove={() => setIngredients((prev) => prev.filter((_, i) => i !== idx))}
            ingredientsCatalog={ingredientsCatalog}
            measures={measures}
            allergens={allergens}
            error={ingredientErrors[idx]}
          />
        ))}
        <button
          type="button"
          onClick={() => setIngredients((prev) => [...prev, { ...emptyIngredient }])}
          className="mb-6 flex items-center gap-1 hover:opacity-70"
        >
          <Icon name="add_circle" size={16} className="text-terracota" />
          <span className="text-terracota font-sans-bold text-[12px]">Agregar ingrediente</span>
        </button>

        <h2 className="font-serif-bold text-[15px] text-oliva dark:text-cream mb-2">Preparación</h2>
        {steps.map((step, idx) => (
          <StepFormRow
            key={idx}
            value={step}
            index={idx}
            total={steps.length}
            error={stepErrors[idx]}
            onChange={(v) => setSteps((prev) => prev.map((p, i) => (i === idx ? v : p)))}
            onRemove={() => setSteps((prev) => prev.filter((_, i) => i !== idx))}
            onMoveUp={() =>
              setSteps((prev) => {
                if (idx === 0) return prev;
                const copy = [...prev];
                [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
                return copy;
              })
            }
            onMoveDown={() =>
              setSteps((prev) => {
                if (idx === prev.length - 1) return prev;
                const copy = [...prev];
                [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
                return copy;
              })
            }
          />
        ))}
        <button type="button" onClick={() => setSteps((prev) => [...prev, { ...emptyStep }])} className="mb-6 flex items-center gap-1 hover:opacity-70">
          <Icon name="add_circle" size={16} className="text-terracota" />
          <span className="text-terracota font-sans-bold text-[12px]">Agregar paso</span>
        </button>

        {submitError ? (
          <p className="text-red-600 text-[12px] font-sans-medium mb-3 text-center">{submitError}</p>
        ) : null}

        <PrimaryButton label="Guardar receta" loading={saving} onClick={handleSubmit} />
      </div>
    </div>
  );
}
