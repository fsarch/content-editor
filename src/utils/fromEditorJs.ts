import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";
import { TContentValue } from "../types/TContentValue.type";
import { inlineBlockUtils } from "./blocks/inline/inline-block.utils";
import { TSectionBlock } from "./blocks/section/section-block.type";
import { TEditorContext } from "../types/TEditorContext";

export function fromEditorJs(data: OutputData, ctx: TEditorContext): TContentValue | null {
  if (!data) {
    return null;
  }

  return {
    meta: {
      version: data.version,
      timestamp: data.time,
    },
    blocks: data.blocks.map((block) => {
      const mapper = ctx.blockManager.section.getByEditorJsType(block.type);
      if (!mapper) {
        console.log('unknown mapper for block type', block.type);
        return null;
      }

      return mapper.fromEditorJs(block, {
        parseInlineBlocks: (html) => inlineBlockUtils.parseInlineBlocks(html, ctx),
      });
    }).filter(b => b) as Array<TSectionBlock>,
  };
}
