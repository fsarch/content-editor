import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";
import { TContentValue } from "../types/TContentValue.type";
import { inlineBlockUtils } from "./blocks/inline/inline-block.utils";

export function fromEditorJs(data?: OutputData): TContentValue | null {
  if (!data) {
    return null;
  }

  return {
    meta: {
      version: data.version,
      timestamp: data.time,
    },
    blocks: data.blocks.map((block) => {
      if (block.type === 'paragraph') {
        const parsedHTML = inlineBlockUtils.parseInlineBlocks(block.data.text);

        return {
          ...block,
          data: parsedHTML,
        };
      }

      return block;
    }),
  };
}
