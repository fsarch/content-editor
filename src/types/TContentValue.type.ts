import type { TSectionBlock } from "../utils/blocks/section/section-block.type";

export type TContentValue = {
  meta: {
    version?: string;
    timestamp?: number;
  };
  blocks: Array<TSectionBlock>;
};
