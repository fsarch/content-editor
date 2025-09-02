import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";
import { TContentValue } from "../types/TContentValue.type";
import { inlineBlockUtils } from "./blocks/inline/inline-block.utils";
import { SECTION_BLOCK_MANAGER } from "./blocks/section";
import { TSectionBlock } from "./blocks/section/section-block.type";

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
      const mapper = SECTION_BLOCK_MANAGER.getByEditorJsType(block.type);
      if (!mapper) {
        return null;
      }

      return mapper.fromEditorJs(block, {
        parseInlineBlocks: inlineBlockUtils.parseInlineBlocks,
      });
    }).filter(b => b) as Array<TSectionBlock>,
  };
}
