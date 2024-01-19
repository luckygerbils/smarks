import React, { useCallback, useState } from "react";
import { EditPane, FolderPaneRow } from ".";
import { byIndex } from "../helpers";
import { folderContextMenu } from "../helpers/folderContextMenu";

interface FolderPaneProps {
  folder: browser.bookmarks.BookmarkTreeNode,
  folderPath: string[],
  selectedNodeId: string,
  onSelect: (nodeId: string) => any,
  onDoubleClick: (node: browser.bookmarks.BookmarkTreeNode, nodePath: string[]) => any,
  onMove: (folder: string, newParentFolderId?: string, newIndex?: number) => any,
  onDelete: (node: browser.bookmarks.BookmarkTreeNode) => any,
}

export function FolderPane({ 
  folder, 
  folderPath,
  selectedNodeId,
  onSelect,
  onDoubleClick,
  onMove,
  onDelete,
} : FolderPaneProps) {
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

  const showContextMenu = useCallback(e => {
    e.stopPropagation();
    folderContextMenu({ node: folder, onDelete, onMove })
  }, [folder, onDelete, onMove]);

  return (
    <div className="flex flex-col overflow-hidden grow" onContextMenu={showContextMenu}>
      {(folder.children ?? []).sort(byIndex).map(childNode => 
          <FolderPaneRow 
            key={childNode.id} 
            node={childNode} 
            nodePath={[...folderPath, childNode.id]}
            isSelected={childNode.id === selectedNodeId}
            onDragStart={drag}
            onSelect={onSelect}
            onDoubleClick={onDoubleClick}
            onDropInside={dropInside}
            onDropBefore={dropBefore} 
            onDropAfter={dropAfter}
            onDelete={onDelete}
            onMove={onMove} />)}
    </div>
  );
}