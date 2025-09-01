import { InlineBlockManager } from "./InlineBlockManager";
import { InlineBlockBuilder } from "./InlineBlockBuilder";
import { TBoldBlock, TItalicBlock, TAnchorBlock, TNewlineBlock } from "../../html.type";
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
  new InlineBlockBuilder<TItalicBlock>('italic')
    .isSupportedHtmlTag((node) => {
      return node.type === "tag" && node.name === "i";
    })
    .htmlToJson((node, context) => ({
      id: inlineBlockUtils.getBlockId(node),
      type: "italic",
      data: {
        children: context.parseChildren(node),
      },
    }))
    .jsonToHTML((value, context) => {
      return `<i ${context.getIdAttribute()}>${(value.data.children || []).map(context.serializeElement).join('')}</i>`;
    })
    .build(),
  new InlineBlockBuilder<TAnchorBlock>('anchor')
    .isSupportedHtmlTag((node) => {
      return node.type === "tag" && node.name === "a";
    })
    .htmlToJson((node, context) => ({
      id: inlineBlockUtils.getBlockId(node),
      type: "anchor",
      data: {
        href: node.attribs?.href || '',
        children: context.parseChildren(node),
      },
    }))
    .jsonToHTML((value, context) => {
      return `<a href="${value.data.href}" ${context.getIdAttribute()}>${(value.data.children || []).map(context.serializeElement).join('')}</a>`;
    })
    .build(),
  new InlineBlockBuilder<TNewlineBlock>('newline')
    .isSupportedHtmlTag((node) => {
      return node.type === "tag" && node.name === "br";
    })
    .htmlToJson((node, context) => ({
      id: inlineBlockUtils.getBlockId(node),
      type: "newline"
    }))
    .jsonToHTML((value, context) => {
      return `<br ${context.getIdAttribute()}>`;
    })
    .build(),
]);
