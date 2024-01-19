import React, { useState, useCallback } from "react";
import { byIndex } from "../helpers";
import { TreePaneFolder } from ".";

interface TreePaneProps {
  root: browser.bookmarks.BookmarkTreeNode,
  expandedFolders: {[nodeId: string] : boolean},
  currentFolder: browser.bookmarks.BookmarkTreeNode,
  onExpandChange: (folder: browser.bookmarks.BookmarkTreeNode, isExpanded: boolean) => any,
  onSelect: (folderPath: string[]) => any,
  onMove: (folder: string, newParentFolderId?: string, newIndex?: number) => any,
  onDelete: (node: browser.bookmarks.BookmarkTreeNode) => any,
}

export function TreePane({ 
  root, 
  expandedFolders, 
  currentFolder, 
  onExpandChange, 
  onSelect,
  onMove,
  onDelete,
}: TreePaneProps) {
  const [draggingNode, setDraggingNode] = useState<browser.bookmarks.BookmarkTreeNode>(null);

  const drag = useCallback(node => {
    setDraggingNode(node);
  }, []);

  const dropInside = useCallback((dropTarget: browser.bookmarks.BookmarkTreeNode) => {
    onMove(draggingNode.id, dropTarget.id);
    setDraggingNode(null);
  }, [draggingNode, onMove, setDraggingNode]);
  const dropBefore = useCallback((dropTarget: browser.bookmarks.BookmarkTreeNode) => {
    onMove(draggingNode.id, dropTarget.parentId, dropTarget.index);
    setDraggingNode(null);
  }, [draggingNode, onMove, setDraggingNode]);
  const dropAfter = useCallback((dropTarget: browser.bookmarks.BookmarkTreeNode) => {
    onMove(draggingNode.id, dropTarget.parentId, dropTarget.index + 1);
    setDraggingNode(null);
  }, [draggingNode, onMove, setDraggingNode]);

  return (
    <div className="flex-none overflow-y-scroll">
      {(root.children ?? []).sort(byIndex).filter(child => child.url == null).map((rootChild, index) => 
        <TreePaneFolder 
          key={rootChild.id}
          node={rootChild}
          nodePath={[rootChild.id]}
          level={0}
          index={index}
          isVisible={true}
          currentFolder={currentFolder}
          expandedFolders={expandedFolders}
          onSelect={onSelect} 
          onExpandChange={onExpandChange}
          onDragStart={drag}
          onDropInside={dropInside}
          onDropBefore={dropBefore}
          onDropAfter={dropAfter}
          onDelete={onDelete}
          onMove={onMove} />)}
    </div>
  );
}