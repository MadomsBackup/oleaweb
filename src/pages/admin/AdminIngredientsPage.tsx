import React from 'react';
import CatalogAdminScreen from '../../components/CatalogAdminScreen';
import { ingredientsApi } from '../../api/catalog';
import { Ingredient } from '../../types';

export default function AdminIngredientsPage() {
  return (
    <CatalogAdminScreen<Ingredient>
      title="Ingredientes"
      api={ingredientsApi}
      fields={[{ key: 'name', label: 'Nombre (ej. Cebolla)' }]}
    />
  );
}
