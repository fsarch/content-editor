import { InlineBlockManager } from "./InlineBlockManager";
import { InlineBlockBuilder } from "./InlineBlockBuilder";
import { TBoldBlock } from "../../html.type";
import { inlineBlockUtils } from "./inline-block.utils";

export const INLINE_BLOCK_MANAGER = new InlineBlockManager([
  new InlineBlockBuilder<TBoldBlock>('bold')
    .isSupportedHtmlTag((node) => {
      return node.type === "tag" && node.name === "b";
    })
    .htmlToJson((node, context) => ({
      id: inlineBlockUtils.getBlockId(node),
      type: "bold",
      data: {
        children: context.parseChildren(node),
      },
    }))
    .jsonToHTML((value, context) => {
      return `<b ${context.getIdAttribute()}>${(value.data.children || []).map(context.serializeElement).join('')}</b>`;
    })
    .build(),
]);
