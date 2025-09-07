import { BlockManager } from "./BlockManager";
import { registerDefaultInlineBlocks } from "./inline";
import { registerDefaultSectionBlocks } from "./section";

export const BLOCK_MANAGER_INSTANCE = new BlockManager();

export const registerDefaultBlocks = (blockManager: BlockManager) => {
  registerDefaultSectionBlocks(blockManager.section);
  registerDefaultInlineBlocks(blockManager.inline);
};

registerDefaultBlocks(BLOCK_MANAGER_INSTANCE);
