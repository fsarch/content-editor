import { SectionBlockManager } from "./section/SectionBlockManager";
import { InlineBlockManager } from "./inline/InlineBlockManager";

export class BlockManager {
  public readonly section = new SectionBlockManager();

  public readonly inline = new InlineBlockManager();
}
