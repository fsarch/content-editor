import type { TBaseBlock } from "../../block.type";
import type { ChildNode } from "domhandler/lib/esm";
import type { TInlineBlock } from "../../html.type";

export type THTMLGenerateContext = {
  mode: 'view' | 'edit';
  getIdAttribute: () => string;
  serializeElement: (values: TInlineBlock) => string;
};

export type THTMLParseContext = {
  parseChildren: (node: ChildNode) => Array<TInlineBlock>;
};

export interface IInlineBlock<T extends TBaseBlock> {
  type: string;

  toHTML(data: T, ctx: THTMLGenerateContext): string;

  fromHTML(value: ChildNode, ctx: THTMLParseContext): T;

  isSupportedHtmlTag(node: ChildNode): boolean;
}
