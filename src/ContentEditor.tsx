'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { TContentValue } from "./types/TContentValue.type";
import { fromEditorJs } from "./utils/fromEditorJs";
import { toEditorJs } from "./utils/toEditorJs";

export const ContentEditor: React.FC<{ onChange: (data: any) => void; value: TContentValue }> = ({ onChange, value }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    const root = editorRef.current;

    if (!root) return;

    const element = document.createElement('div');
    root.appendChild(element);

    const instance = new EditorJS({
      data: toEditorJs(value) ?? undefined,
      holder: element,
      onChange: async () => {
        const data = await instance.save();
        onChange(fromEditorJs(data));
      },
    });

    return () => {
      (async () => {
        await instance.isReady;

        instanceRef.current?.destroy();
        instanceRef.current = null;

        root.removeChild(element);
      })();
    };
  }, [onChange]);

  return <div ref={editorRef} />;
};

