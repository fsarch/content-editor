import type { ChildNode, Element, Text } from "domhandler";

function isElementNode(node: ChildNode): node is Element {
  return node.type === "tag";
}

function isTextNode(node: ChildNode): node is Text {
  return node.type === "text";
}

export const nodeUtils = {
  isElementNode,
  isTextNode,
}
