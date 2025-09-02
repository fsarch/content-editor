import { TContentValue } from "../types/TContentValue.type";
import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";
import { inlineBlockUtils } from "./blocks/inline/inline-block.utils";

export function toEditorJs(data?: TContentValue): OutputData | null {
  if (!data) {
    return null;
  }

  return {
    blocks: data.blocks.map((block) => {
      if (block.type === 'paragraph') {
        return {
          ...block,
          data: {
            text: inlineBlockUtils.serializeAsHtml(block.data),
          },
        };
      }

      return block;
    }),
    version: data.meta.version,
    time: data.meta.timestamp,
  }
}
