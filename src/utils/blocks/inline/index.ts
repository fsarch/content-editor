import { InlineBlockManager } from "./InlineBlockManager";
import { InlineBlockBuilder } from "./InlineBlockBuilder";
import { TBoldBlock, TItalicBlock, TAnchorBlock, TNewlineBlock, TUnderlineBlock } from "../../html.type";
import { inlineBlockUtils } from "./inline-block.utils";

export const registerDefaultInlineBlocks = (inlineBlockManager: InlineBlockManager) => {
  // BOLD
  inlineBlockManager.register(
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
      .build()
  );

  // ITALIC
  inlineBlockManager.register(
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
      .build()
  );

  // UNDERLINE
  inlineBlockManager.register(
    new InlineBlockBuilder<TUnderlineBlock>('underline')
      .isSupportedHtmlTag((node) => {
        return node.type === "tag" && node.name === "u";
      })
      .htmlToJson((node, context) => ({
        id: inlineBlockUtils.getBlockId(node),
        type: "underline",
        data: {
          children: context.parseChildren(node),
        },
      }))
      .jsonToHTML((value, context) => {
        return `<u ${context.getIdAttribute()}>${(value.data.children || []).map(context.serializeElement).join('')}</u>`;
      })
      .build()
  );

  // ANCHOR
  inlineBlockManager.register(
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
      .build()
  );

  // NEWLINE
  inlineBlockManager.register(
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
      .build()
  );
};
