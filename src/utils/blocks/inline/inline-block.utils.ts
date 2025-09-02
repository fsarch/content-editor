import { generateBlockId } from "../../id";
import { THTMLParseContext } from "./IInlineBlock";
import type { ChildNode } from "domhandler";
import { DomUtils } from "htmlparser2";
import { TInlineBlock } from "../../html.type";
import { INLINE_BLOCK_MANAGER } from "./index";
import { nodeUtils } from "../../node.utils";
import { parseDocument } from "htmlparser2";

function getBlockId(node: any): string {
  return node.attribs?.['data-block-id'] || generateBlockId();
}

function parseBlockBase(node: ChildNode): TInlineBlock | null {
  if (nodeUtils.isTextNode(node)) {
    return {
      id: '',
      type: 'text',
      data: {
        value: node.data,
      },
    };
  }

  const block = INLINE_BLOCK_MANAGER.getByHTMLTag(node);
  if (!block) {
    return null;
  }

  if (!nodeUtils.isElementNode(node)) {
    return null;
  }

  const htmlParseContext: THTMLParseContext = {
    parseChildren: (node: ChildNode) => {
      return DomUtils.getChildren(node)
        .map(parseBlockBase)
        .filter(b => b) as Array<TInlineBlock>;
    },
  }

  return block.fromHTML(node, htmlParseContext);
}

function parseInlineBlocks(html: string) {
  const doc = parseDocument(html);
  const bodyChildren = DomUtils.getChildren(doc);

  const blocks = bodyChildren
    .map(parseBlockBase)
    .filter(b => b !== null);

  return blocks;
}

function serializeAsHtmlBase(block: TInlineBlock): string {
  if (block.type === 'text') {
    return block.data.value || '';
  }

  const idAttr = ` data-block-id="${block.id}"`;

  const inlineBlock = INLINE_BLOCK_MANAGER.getByType(block.type);
  if (inlineBlock) {
    return inlineBlock.toHTML(block, {
      mode: 'view',
      getIdAttribute: () => idAttr,
      serializeElement: serializeAsHtmlBase,
    });
  }

  return '';
}

function serializeAsHtml(blocks: Array<TInlineBlock>): string {
  return blocks.map(serializeAsHtmlBase).filter(b => b).join('');
}

export const inlineBlockUtils = {
  getBlockId,
  parseInlineBlocks,
  serializeAsHtml,
};
