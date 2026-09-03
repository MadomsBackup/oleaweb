export interface RichSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
}

/**
 * Formato liviano guardado como texto plano en `PreparationStep.content`:
 * **negrita**, *cursiva*, ~~tachado~~. Se guarda como string simple y se
 * renderiza con `RichText`. Idéntico al parser de la app mobile para que
 * el contenido se vea igual en ambas plataformas.
 */
export function parseRichText(source: string): RichSegment[] {
  const segments: RichSegment[] = [];
  const regex = /(\*\*.+?\*\*|\*.+?\*|~~.+?~~)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(source))) {
    if (match.index > lastIndex) {
      segments.push({ text: source.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith('**')) {
      segments.push({ text: token.slice(2, -2), bold: true });
    } else if (token.startsWith('~~')) {
      segments.push({ text: token.slice(2, -2), strike: true });
    } else {
      segments.push({ text: token.slice(1, -1), italic: true });
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < source.length) {
    segments.push({ text: source.slice(lastIndex) });
  }

  return segments;
}

export function wrapSelection(
  text: string,
  selStart: number,
  selEnd: number,
  token: '**' | '*' | '~~',
): { text: string; cursor: number } {
  if (selStart === selEnd) {
    const inserted = `${token}${token}`;
    return {
      text: text.slice(0, selStart) + inserted + text.slice(selStart),
      cursor: selStart + token.length,
    };
  }
  const selected = text.slice(selStart, selEnd);
  const wrapped = `${token}${selected}${token}`;
  return {
    text: text.slice(0, selStart) + wrapped + text.slice(selEnd),
    cursor: selStart + wrapped.length,
  };
}

export function sanitizeFileName(name: string): string {
  return name.trim().replace(/[\\/:*?"<>|]+/g, '').slice(0, 80) || 'receta';
}
