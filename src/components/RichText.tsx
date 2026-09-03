import React from 'react';
import { parseRichText } from '../utils/richText';

interface Props {
  content: string;
  className?: string;
}

export default function RichText({ content, className }: Props) {
  const segments = parseRichText(content);
  return (
    <p className={className}>
      {segments.map((seg, idx) => (
        <span
          key={idx}
          style={{
            fontWeight: seg.bold ? 700 : 400,
            fontStyle: seg.italic ? 'italic' : 'normal',
            textDecorationLine: seg.strike ? 'line-through' : 'none',
          }}
        >
          {seg.text}
        </span>
      ))}
    </p>
  );
}
