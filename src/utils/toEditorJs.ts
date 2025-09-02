import { TContentValue } from "../types/TContentValue.type";
import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";
import { inlineBlockUtils } from "./blocks/inline/inline-block.utils";
import { SECTION_BLOCK_MANAGER } from "./blocks/section";
import { TSectionBlock } from "./blocks/section/section-block.type";

export function toEditorJs(data?: TContentValue): OutputData | null {
  if (!data) {
    return null;
  }

  return {
    blocks: data.blocks.map((block) => {
      const mapper = SECTION_BLOCK_MANAGER.getByType(block.type);
      if (!mapper) {
        return null;
      }

      return mapper.toEditorJs(block as TSectionBlock, {
        serializeInlineBlocks: inlineBlockUtils.serializeAsHtml,
      });
    }).filter(b => b) as Array<TSectionBlock>,
    version: data.meta.version,
    time: data.meta.timestamp,
  }
}
