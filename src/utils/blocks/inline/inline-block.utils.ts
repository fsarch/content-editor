import { generateBlockId } from "../../id";

function getBlockId(node: any): string {
  return node.attribs?.['data-block-id'] || generateBlockId();
}

export const inlineBlockUtils = {
  getBlockId,
};
