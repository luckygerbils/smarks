import React, { useCallback, useEffect, useState } from "react";

import "./Page.css";
import { EditPane, FolderPane, TreePane } from ".";
import { moveBookmark, getBookmarksTree, removeBookmark, removeTree, updateBookmark } from "../api";
import { findNode } from "../helpers";
import { node } from "webpack";

interface PageProps {
  defaultRoot: browser.bookmarks.BookmarkTreeNode,
  defaultExpandedFolders: {[nodeId:string]: boolean},
  defaultCurrentFolderPath: string[],
  selectedNodeId: string,
}

export function Page({ 
  defaultRoot, 
  defaultExpandedFolders={}, 
  defaultCurrentFolderPath=[],
}: PageProps) {
  const [root, setRoot] = useState(defaultRoot);
  const [expandedFolders, setExpandedFolders] = useState(defaultExpandedFolders);

  const [currentFolderPath, setCurrentFolderPath] = useState(defaultCurrentFolderPath);
  const currentFolder = findNode(root, currentFolderPath);
  const [selectedNodeId, setSelectedNodeId] =  useState(currentFolder.children?.[0]?.id);
  const selectedNode = findNode(root, [...currentFolderPath, selectedNodeId]) || currentFolder;

  const changeExpandedFolders = useCallback((node: browser.bookmarks.BookmarkTreeNode, isExpanded: boolean) => {
    setExpandedFolders(expanded => {
      const expandedFolders = { ...expanded, [node.id]: isExpanded };
      if (!isExpanded && node.children != null) {
        collapseNodeAndAllChildren(node, expandedFolders);
      }
      browser.storage.local.set({ expandedFolders });
      return expandedFolders;
    });
  }, [setExpandedFolders]);

  const changeCurrentFolderPath = useCallback((currentFolderPath: string[]) => {
    const selectedNodeId = findNode(root, currentFolderPath).children?.[0]?.id;
    setCurrentFolderPath(currentFolderPath);
    setSelectedNodeId(selectedNodeId);
    browser.storage.local.set({ currentFolderPath, selectedNodeId });
    setExpandedFolders(expanded => {
      const expandedFolders = Object.assign(expanded);
      currentFolderPath.slice(0, currentFolderPath.length - 1).forEach(id => expandedFolders[id] = true);
      browser.storage.local.set({ expandedFolders });
      return expandedFolders;
    });
  }, [root]);

  const selectFolder = useCallback((folderPath: string[]) => {
    changeCurrentFolderPath(folderPath);
  }, [changeCurrentFolderPath]);

  const selectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    browser.storage.local.set({ selectedNodeId: nodeId });
  }, []);

  const openNode = useCallback((node: browser.bookmarks.BookmarkTreeNode, nodePath: string[]) => {
    if (node.type === "bookmark") {
      document.location = node.url;
    } else {
      changeCurrentFolderPath(nodePath);
    }
  }, [changeCurrentFolderPath]);

  const move = useCallback(async (folderId: string, newParentFolderId?: string, newIndex?: number) => {
    await moveBookmark(folderId, newParentFolderId, newIndex);
    const root = await getBookmarksTree();
    setRoot(root);
  }, []);

  const remove = useCallback(async (node: browser.bookmarks.BookmarkTreeNode) => {
    if (node.url != null) {
      await removeBookmark(node.id);
    } else {
      await removeTree(node.id);
    }
    const root = await getBookmarksTree();
    setRoot(root);
  }, []);

  // const handleKeyDown = useCallback(e => {
  //   switch (e.key) {
  //   case "Delete":
  //     remove(currentNode);
  //   }
  // }, [currentNode, remove]);

  useEffect(() => {
    document.title = "Bookmarks (S-Marks)";
    // document.addEventListener("keydown", handleKeyDown);
    // return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateNode = useCallback((node: browser.bookmarks.BookmarkTreeNode, changes: {title?: string, url?: string}) =>
    updateBookmark(node.id, changes), []);

  const showRegularContextMenu = useCallback(() => {
    browser.menus.removeAll();
  }, []);

  return (
    <div className="h-full flex flex-row items-stretch" onContextMenu={showRegularContextMenu}>
      <TreePane 
        root={root} 
        expandedFolders={expandedFolders} 
        currentFolder={currentFolder} 
        onExpandChange={changeExpandedFolders} 
        onSelect={selectFolder}
        onMove={move}
        onDelete={remove} />

      <div className="flex flex-col overflow-hidden grow">
        <FolderPane 
          folder={currentFolder}
          folderPath={currentFolderPath}
          selectedNodeId={selectedNodeId}
          onSelect={selectNode}
          onDoubleClick={openNode}
          onMove={move}
          onDelete={remove} />
        <EditPane 
          node={selectedNode}
          onChange={updateNode} />
      </div>
    </div>
  );
}

function collapseNodeAndAllChildren(node: browser.bookmarks.BookmarkTreeNode, expanded: {[nodeId:string]: boolean}) {
  node.children.forEach(child => {
    expanded[child.id] = false;
    if (child.children != null) {
      collapseNodeAndAllChildren(child, expanded);
    }
  });
}