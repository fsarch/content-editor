import { TContentValue } from "../types/TContentValue.type";
import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";
import { inlineBlockUtils } from "./blocks/inline/inline-block.utils";
import { TSectionBlock } from "./blocks/section/section-block.type";
import { TEditorContext } from "../types/TEditorContext";

export function toEditorJs(data: TContentValue, ctx: TEditorContext): OutputData | null {
  if (!data) {
    return null;
  }

  return {
    blocks: data.blocks.map((block) => {
      const mapper = ctx.blockManager.section.getByType(block.type);
      if (!mapper) {
        return null;
      }

      return mapper.toEditorJs(block, {
        serializeInlineBlocks: (blocks) => inlineBlockUtils.serializeAsHtml(blocks, ctx),
      });
    }).filter(b => b) as Array<TSectionBlock>,
    version: data.meta.version,
    time: data.meta.timestamp,
  }
}
