import React from 'react';
import CatalogAdminScreen from '../../components/CatalogAdminScreen';
import { measuresApi } from '../../api/catalog';
import { Measure } from '../../types';

export default function AdminMeasuresPage() {
  return (
    <CatalogAdminScreen<Measure>
      title="Medidas"
      api={measuresApi}
      fields={[
        { key: 'name', label: 'Nombre (ej. Gramo)' },
        { key: 'abbreviation', label: 'Abreviatura (ej. g)' },
        {
          key: 'unitType',
          label: 'Tipo',
          choices: [
            { value: 'weight', label: 'Peso' },
            { value: 'volume', label: 'Volumen' },
            { value: 'unit', label: 'Unidad' },
          ],
        },
        { key: 'baseFactor', label: 'Factor base (ej. 1)', keyboardType: 'numeric' },
      ]}
      renderSubtitle={(item) => `${item.abbreviation} · ${item.unitType}`}
    />
  );
}
