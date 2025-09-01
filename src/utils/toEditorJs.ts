import { TContentValue } from "../types/TContentValue.type";
import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";
import { htmlUtils } from "./html.utils";

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
            text: htmlUtils.blocksToHTML(block.data),
          },
        };
      }

      return block;
    }),
    version: data.meta.version,
    time: data.meta.timestamp,
  }
}
