import { IInlineBlock } from "./IInlineBlock";
import { ChildNode } from "domhandler";

export class InlineBlockManager {
  private readonly blocks: Array<IInlineBlock<any>> = [];

  constructor(
    blocks: Array<IInlineBlock<any>> = [],
  ) {
    this.register = this.register.bind(this);

    blocks.forEach(this.register);
  }

  public register(block: IInlineBlock<any>): void {
    this.blocks.push(block);
  }

  public getByHTMLTag(node: ChildNode): IInlineBlock<any> | null {
    return this.blocks.find((block) => block.isSupportedHtmlTag(node)) ?? null;
  }

  public getByType(type: string): IInlineBlock<any> | null {
    return this.blocks.find((block) => block.type === type) ?? null;
  }
}
