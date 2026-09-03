import React from 'react';
import CatalogAdminScreen from '../../components/CatalogAdminScreen';
import { categoriesApi } from '../../api/catalog';
import { Category } from '../../types';

export default function AdminCategoriesPage() {
  return (
    <CatalogAdminScreen<Category>
      title="Categorías"
      api={categoriesApi}
      fields={[
        { key: 'name', label: 'Nombre (ej. Postres)' },
        { key: 'description', label: 'Descripción (opcional)' },
      ]}
      renderSubtitle={(item) => item.description ?? ''}
    />
  );
}
