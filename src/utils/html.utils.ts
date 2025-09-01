import { parseDocument, DomUtils } from "htmlparser2";
import type { ChildNode } from "domhandler";
import { TInlineBlock } from "./html.type";
import { generateBlockId } from './id';
import { inlineBlockUtils } from "./blocks/inline/inline-block.utils";
import { INLINE_BLOCK_MANAGER } from "./blocks/inline";
import { THTMLParseContext } from "./blocks/inline/IInlineBlock";

function isElementNode(node: ChildNode): node is import("domhandler").Element {
  return node.type === "tag";
}

function isTextNode(node: ChildNode): node is import("domhandler").Text {
  return node.type === "text";
}

function parseBlock(node: ChildNode): TInlineBlock | null {
  if (isTextNode(node)) {
    return {
      id: '',
      type: 'text',
      data: { value: node.data },
    };
  }
  if (!isElementNode(node)) return null;

  switch (node.name) {
    case "p":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "paragraph",
        data: {
          children: DomUtils.getChildren(node)
            .map(parseBlock)
            .filter(b => b) as Array<TInlineBlock>
        },
      };

    case "b":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "bold",
        data: {
          children: DomUtils.getChildren(node)
            .map(parseBlock)
            .filter(b => b) as Array<TInlineBlock>
        }
      };

    case "i":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "italic",
        data: {
          children: DomUtils.getChildren(node)
            .map(parseBlock)
            .filter(b => b) as Array<TInlineBlock>
        }
      };

    case "h1": case "h2": case "h3":
    case "h4": case "h5": case "h6":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "header",
        data: {
          children: DomUtils.getChildren(node).map(parseBlock).filter(b => b) as Array<TInlineBlock>,
          level: parseInt(node.name.substring(1), 10)
        }
      };

    case "ul":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "list",
        data: {
          style: "unordered",
          children: DomUtils.getChildren(node)
            .map(li => DomUtils.getChildren(li)
              .map(parseBlock)
              .filter(b => b) as Array<TInlineBlock>
            ).flat()
        }
      };

    case "ol":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "list",
        data: {
          style: "ordered",
          children: DomUtils.getChildren(node)
            .map(li => DomUtils.getChildren(li).map(parseBlock).filter(b => b) as Array<TInlineBlock>)
            .filter(b => b).flat() as Array<TInlineBlock>
        }
      };

    case "blockquote":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "quote",
        data: {
          children: DomUtils.getChildren(node)
            .map(parseBlock)
            .filter(b => b) as Array<TInlineBlock>,
          caption: ""
        },
      };

    case "img":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "image",
        data: {
          file: { url: node.attribs?.src || "" },
          caption: node.attribs?.alt || "",
          withBorder: false,
          stretched: false,
          withBackground: false
        }
      };

    case "br":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "newline"
      };

    case "a":
      return {
        id: inlineBlockUtils.getBlockId(node),
        type: "anchor",
        data: {
          href: node.attribs?.href || '',
          children: DomUtils.getChildren(node)
            .map(parseBlock)
            .filter(b => b) as Array<TInlineBlock>
        }
      };

    default: {
      const htmlParseContext: THTMLParseContext = {
        parseChildren: (node: ChildNode) => {
          return DomUtils.getChildren(node)
            .map(parseBlock)
            .filter(b => b) as Array<TInlineBlock>;
        },
      }

      const block = INLINE_BLOCK_MANAGER.getByHTMLTag(node);
      if (!block) {
        return null;
      }

      block.fromHTML(node, htmlParseContext);

      return null;
    }
  }
}

function parseHTMLToBlocks(html: string) {
  const doc = parseDocument(html);
  const bodyChildren = DomUtils.getChildren(doc);

  console.log('docs', doc, bodyChildren);

  const blocks = bodyChildren
    .map(parseBlock)
    .filter(b => b !== null);

  return blocks;
}

function blocksToHTML(blocks: TInlineBlock[]): string {
  function blockToHTML(block: TInlineBlock): string {
    const idAttr = ` data-block-id="${block.id}"`;
    switch (block.type) {
      case 'paragraph':
        return `<p${idAttr}>${(block.data.children || []).map(blockToHTML).join('')}</p>`;
      case 'italic':
        return `<i${idAttr}>${(block.data.children || []).map(blockToHTML).join('')}</i>`;
      case 'header':
        const level = block.data.level || 1;
        return `<h${level}${idAttr}>${(block.data.children || []).map(blockToHTML).join('')}</h${level}>`;
      case 'quote':
        return `<blockquote${idAttr}>${(block.data.children || []).map(blockToHTML).join('')}${block.data.caption ? `<footer>${block.data.caption}</footer>` : ''}</blockquote>`;
      case 'list':
        if ((block as any).data.style === 'ordered') {
          return `<ol${idAttr}>${(block.data.children || []).map(blockToHTML).map(html => `<li>${html}</li>`).join('')}</ol>`;
        } else {
          return `<ul${idAttr}>${(block.data.children || []).map(blockToHTML).map(html => `<li>${html}</li>`).join('')}</ul>`;
        }
      case 'text':
        return block.data.value;
      case 'image':
        return `<img${idAttr} src="${block.data.file.url}" alt="${block.data.caption || ''}" />`;
      case 'newline':
        return `<br${idAttr}>`;
      case 'anchor':
        return `<a${idAttr} href="${block.data.href}">${(block.data.children || []).map(blockToHTML).join('')}</a>`;
      case 'custom':
        return '';
      default: {
        const inlineBlock = INLINE_BLOCK_MANAGER.getByType(block.type);
        if (inlineBlock) {
          return inlineBlock.toHTML(block, {
            mode: 'view',
            getIdAttribute: () => idAttr,
            serializeElement: blockToHTML,
          });
        }
        return '';
      }
    }
  }
  return blocks.map(blockToHTML).join('');
}

export const htmlUtils = {
  parseHTMLToBlocks,
  blocksToHTML,
};
