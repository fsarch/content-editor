import { TBaseBlock } from "../../block.type";
import type { IInlineBlock, THTMLGenerateContext, THTMLParseContext } from "./IInlineBlock";
import { Element } from "domhandler";

export class InlineBlockBuilder<T extends TBaseBlock> {
  private htmlToJsonCb: ((html: Element, context: THTMLParseContext) => T) | null = null;

  private jsonToHtmlCb: ((data: T, options: THTMLGenerateContext) => string) | null = null;

  private isSupportedHtmlTagCb: ((node: Element) => boolean) | null = null;

  constructor(private readonly type: string) {
  }

  htmlToJson(cb: (html: Element, context: THTMLParseContext) => T): this {
    this.htmlToJsonCb = cb;

    return this;
  }

  jsonToHTML(cb: (data: T, options: THTMLGenerateContext) => string): this {
    this.jsonToHtmlCb = cb;

    return this;
  }

  isSupportedHtmlTag(cb: (node: Element) => boolean): this {
    this.isSupportedHtmlTagCb = cb;

    return this;
  }

  private buildClass() {
    const { jsonToHtmlCb, htmlToJsonCb, type, isSupportedHtmlTagCb } = this;

    if (!type) {
      throw new Error('type is not defined');
    }

    if (!jsonToHtmlCb) {
      throw new Error('jsonToHtmlCb is not defined');
    }

    if (!htmlToJsonCb) {
      throw new Error('htmlToJsonCb is not defined');
    }

    if (!isSupportedHtmlTagCb) {
      throw new Error('isSupportedHtmlTagCb is not defined');
    }

    return class InlineBlockImpl implements IInlineBlock<T> {
      type = type;

      toHTML(data: T, ctx: THTMLGenerateContext): string {
        return jsonToHtmlCb(data, ctx);
      }

      fromHTML(node: Element, ctx: THTMLParseContext): T {
        return htmlToJsonCb(node, ctx);
      }

      isSupportedHtmlTag(node: Element) {
        return isSupportedHtmlTagCb(node);
      }
    }
  }

  build() {
    const InlineBlockImpl = this.buildClass();

    return new InlineBlockImpl();
  }
}
