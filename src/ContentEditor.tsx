'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { TContentValue } from "./types/TContentValue.type";
import { fromEditorJs } from "./utils/fromEditorJs";
import { toEditorJs } from "./utils/toEditorJs";

import EditorjsList from '@editorjs/list';
import Underline from "@editorjs/underline";
import Heading from "@editorjs/header";
import { BlockManager } from "./utils/blocks/BlockManager";
import { BLOCK_MANAGER_INSTANCE } from "./utils/blocks";

export const ContentEditor: React.FC<{
  onChange: (data: any) => void;
  value: TContentValue;
  blockManager?: BlockManager;
}> = ({
  onChange,
  value,
  blockManager = BLOCK_MANAGER_INSTANCE,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    const root = editorRef.current;

    if (!root) return;

    const element = document.createElement('div');
    root.appendChild(element);

    const instance = new EditorJS({
      data: toEditorJs(value, {
        blockManager,
      }) ?? undefined,
      holder: element,
      tools: {
        list: {
          class: EditorjsList as any,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        underline: Underline,
        headline: Heading,
      },
      onChange: async () => {
        const data = await instance.save();
        onChange(fromEditorJs(data, { blockManager }));
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

