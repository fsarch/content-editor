import { parseDocument, DomUtils } from "htmlparser2";
import type { ChildNode } from "domhandler";
import { TInlineBlock } from "./html.type";

function isElementNode(node: ChildNode): node is import("domhandler").Element {
  return node.type === "tag";
}

function isTextNode(node: ChildNode): node is import("domhandler").Text {
  return node.type === "text";
}

function parseBlock(node: ChildNode): TInlineBlock | null {
  if (isTextNode(node)) {
    return {
      type: 'text',
      data: { value: node.data },
    };
  }

  if (!isElementNode(node)) return null;

  console.log('node', node, node.name)

  switch (node.name) {
    case "p":
      return {
        type: "paragraph",
        data: {
          children: DomUtils.getChildren(node)
            .map(parseBlock)
            .filter(b => b) as Array<TInlineBlock>
        },
      };

    case "b":
      return {
        type: "bold",
        data: {
          children: DomUtils.getChildren(node)
            .map(parseBlock)
            .filter(b => b) as Array<TInlineBlock>
        }
      };

    case "i":
      return {
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
        type: "header",
        data: {
          children: DomUtils.getChildren(node).map(parseBlock).filter(b => b) as Array<TInlineBlock>,
          level: parseInt(node.name.substring(1), 10)
        }
      };

    case "ul":
      return {
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
        type: "newline"
      };

    case "a":
      return {
        type: "anchor",
        data: {
          href: node.attribs?.href || '',
          children: DomUtils.getChildren(node)
            .map(parseBlock)
            .filter(b => b) as Array<TInlineBlock>
        }
      };

    default:
      return null;
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
    switch (block.type) {
      case 'paragraph':
        return `<p>${(block.data.children || []).map(blockToHTML).join('')}</p>`;
      case 'bold':
        return `<b>${(block.data.children || []).map(blockToHTML).join('')}</b>`;
      case 'italic':
        return `<i>${(block.data.children || []).map(blockToHTML).join('')}</i>`;
      case 'header':
        const level = block.data.level || 1;
        return `<h${level}>${(block.data.children || []).map(blockToHTML).join('')}</h${level}>`;
      case 'quote':
        return `<blockquote>${(block.data.children || []).map(blockToHTML).join('')}${block.data.caption ? `<footer>${block.data.caption}</footer>` : ''}</blockquote>`;
      case 'list':
        if ((block as any).data.style === 'ordered') {
          return `<ol>${(block.data.children || []).map(blockToHTML).map(html => `<li>${html}</li>`).join('')}</ol>`;
        } else {
          return `<ul>${(block.data.children || []).map(blockToHTML).map(html => `<li>${html}</li>`).join('')}</ul>`;
        }
      case 'text':
        return block.data.value;
      case 'image':
        return `<img src="${block.data.file.url}" alt="${block.data.caption || ''}" />`;
      case 'newline':
        return '<br>';
      case 'anchor':
        return `<a href="${block.data.href}">${(block.data.children || []).map(blockToHTML).join('')}</a>`;
      case 'custom':
        return '';
      default:
        return '';
    }
  }
  return blocks.map(blockToHTML).join('');
}

export const htmlUtils = {
  parseHTMLToBlocks,
  blocksToHTML,
};
