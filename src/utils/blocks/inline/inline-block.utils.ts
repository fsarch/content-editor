import { generateBlockId } from "../../id";
import { THTMLParseContext } from "./IInlineBlock";
import type { ChildNode } from "domhandler";
import { DomUtils } from "htmlparser2";
import { TInlineBlock } from "../../html.type";
import { nodeUtils } from "../../node.utils";
import { parseDocument } from "htmlparser2";
import { TEditorContext } from "../../../types/TEditorContext";

function getBlockId(node: any): string {
  return node.attribs?.['data-block-id'] || generateBlockId();
}

function parseBlockBase(node: ChildNode, ctx: TEditorContext): TInlineBlock | null {
  if (nodeUtils.isTextNode(node)) {
    return {
      id: '',
      type: 'text',
      data: {
        value: node.data,
      },
    };
  }

  const block = ctx.blockManager.inline.getByHTMLTag(node);
  if (!block) {
    return null;
  }

  if (!nodeUtils.isElementNode(node)) {
    return null;
  }

  const htmlParseContext: THTMLParseContext = {
    parseChildren: (node: ChildNode) => {
      return DomUtils.getChildren(node)
        .map((b) => parseBlockBase(b, ctx))
        .filter(b => b) as Array<TInlineBlock>;
    },
  }

  return block.fromHTML(node, htmlParseContext);
}

function parseInlineBlocks(html: string, ctx: TEditorContext) {
  const doc = parseDocument(html);
  const bodyChildren = DomUtils.getChildren(doc);

  const blocks = bodyChildren
    .map((b) => parseBlockBase(b, ctx))
    .filter(b => b !== null);

  return blocks;
}

function serializeAsHtmlBase(block: TInlineBlock, ctx: TEditorContext): string {
  if (block.type === 'text') {
    return block.data.value || '';
  }

  const idAttr = ` data-block-id="${block.id}"`;

  const inlineBlock = ctx.blockManager.inline.getByType(block.type);
  if (inlineBlock) {
    return inlineBlock.toHTML(block, {
      mode: 'view',
      getIdAttribute: () => idAttr,
      serializeElement: (block: TInlineBlock) => serializeAsHtmlBase(block, ctx),
    });
  }

  return '';
}

function serializeAsHtml(blocks: Array<TInlineBlock>, ctx: TEditorContext): string {
  return blocks
    .map((b) => serializeAsHtmlBase(b, ctx))
    .filter(b => b)
    .join('');
}

export const inlineBlockUtils = {
  getBlockId,
  parseInlineBlocks,
  serializeAsHtml,
};
