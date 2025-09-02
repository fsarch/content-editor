import type { ChildNode, Element } from "domhandler";

import type { TBaseBlock } from "../../block.type";
import type { TInlineBlock } from "../../html.type";

export type THTMLGenerateContext = {
  mode: 'view' | 'edit';
  getIdAttribute: () => string;
  serializeElement: (values: TInlineBlock) => string;
};

export type THTMLParseContext = {
  parseChildren: (node: Element) => Array<TInlineBlock>;
};

export interface IInlineBlock<T extends TBaseBlock> {
  type: string;

  toHTML(data: T, ctx: THTMLGenerateContext): string;

  fromHTML(value: Element, ctx: THTMLParseContext): T;

  isSupportedHtmlTag(node: ChildNode): boolean;
}
