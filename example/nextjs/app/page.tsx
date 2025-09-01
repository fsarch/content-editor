'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { TContentValue } from "../../../src/types/TContentValue.type";

const ContentEditor = dynamic(async () => (await import('@fsarch/content-editor')).ContentEditor, { ssr: false });

export default function Home() {
  const [value, setValue] = React.useState<TContentValue | null>(null);
  const [key, setKey] = React.useState(0);
  const handleChange = useCallback((val: TContentValue) => {
    setValue(val);
  }, [setValue]);

  const handleSave = useCallback(() => {
    localStorage.setItem('saved-data', JSON.stringify(value));
  }, [value]);

  const handleLoad = useCallback(() => {
    setValue(JSON.parse(localStorage.getItem('saved-data') ?? 'null'));
    setKey((i) => i + 1);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Next.js App Router Beispiel: Content Editor</h1>
      <button type="button" onClick={handleSave}>Save</button>
      <button type="button" onClick={handleLoad}>Load</button>
      <ContentEditor
        key={key}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}

