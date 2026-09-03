import React from 'react';
import CatalogAdminScreen from '../../components/CatalogAdminScreen';
import { allergensApi } from '../../api/catalog';
import { Allergen } from '../../types';

export default function AdminAllergensPage() {
  return (
    <CatalogAdminScreen<Allergen>
      title="Alérgenos"
      api={allergensApi}
      fields={[
        { key: 'name', label: 'Nombre (ej. Gluten)' },
        { key: 'emoji', label: 'Emoji (ej. 🌾)' },
      ]}
      renderSubtitle={(item) => item.emoji}
    />
  );
}
