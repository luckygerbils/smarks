import React, { useState, useCallback } from "react";
import { byIndex } from "../helpers";
import c from "classnames";
import { MoveIndicator } from ".";
import { FolderIcon, ChevronDownIcon, ChevronRightIcon } from "./icons";
import { folderContextMenu } from "../helpers/folderContextMenu";

interface TreePaneFolderProps {
  node: browser.bookmarks.BookmarkTreeNode,
  nodePath: string[],
  level: number,
  index: number,
  currentFolder: browser.bookmarks.BookmarkTreeNode,
  expandedFolders: {[nodeId: string] : boolean},
  isVisible: boolean,
  onSelect: (folderPath: string[]) => any,
  onExpandChange: (node: browser.bookmarks.BookmarkTreeNode, isExpanded: boolean) => any,
  onDragStart: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onDropInside: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onDropBefore: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onDropAfter: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onDelete: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onMove: (folder: string, newParentFolderId?: string, newIndex?: number) => any,
}

export function TreePaneFolder({ 
  node,
  nodePath,
  level, 
  index,
  currentFolder, 
  expandedFolders, 
  isVisible, 
  onSelect, 
  onExpandChange,
  onDragStart,
  onDropInside,
  onDropBefore,
  onDropAfter,
  onDelete,
  onMove,
}: TreePaneFolderProps) {
  const childFolders = (node.children ?? []).filter(child => child.url == null).sort(byIndex);
  const isSelected = currentFolder === node;
  const isExpanded = expandedFolders[node.id];

  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [isDropInsideTarget, setIsDropInsideTarget] = useState(false);

  const expandToggle = useCallback(() => onExpandChange(node, !isExpanded), [onExpandChange, node, isExpanded]);
  const expand = useCallback(() => onExpandChange(node, true), [onExpandChange, node]);
  const select = useCallback(() => onSelect(nodePath), [onSelect, nodePath]);
  const dragStart = useCallback(() => {
    setIsBeingDragged(true);
    onDragStart(node);
  }, [setIsBeingDragged, onDragStart, node]);
  const dragEnd = useCallback(() => {
    setIsBeingDragged(false);
  }, [setIsBeingDragged]);

  const allowDrop = useCallback(event => event.preventDefault(), []);
  const dropInside = useCallback(() => {
    setIsDropInsideTarget(false);
    onDropInside(node);
  }, [onDropInside, node]);
  const dropBefore = useCallback(() => { onDropBefore(node); }, [onDropBefore, node])
  const dropAfter = useCallback(() => { onDropAfter(node); }, [onDropAfter, node])

  const markAsDropInsideTarget = useCallback(() => setIsDropInsideTarget(true), [setIsDropInsideTarget]);
  const unmarkAsDropInsideTarget = useCallback(() => setIsDropInsideTarget(false), [setIsDropInsideTarget]);

  const showContextMenu = useCallback(e => {
    e.stopPropagation();
    folderContextMenu({ node, onDelete, onMove });
  }, [node, onDelete, onMove]);

  const style = {
    ...(isSelected && !isBeingDragged ? {backgroundColor: "-moz-menuhover"} : {}),
    ...(isSelected && !isBeingDragged ? {color: "white"} : {}),
    paddingLeft: `${level*2}rem`,
    ...(isVisible ? {
      marginTop: "-0.4rem",
      marginBottom: "-0.1rem"
    } : {})
  };
  
  return (
    <>
      {isVisible && index === 0 && 
        <MoveIndicator level={level} onDrop={dropBefore} />}

      <div 
        className={c("flex whitespace-nowrap select-none", isVisible ? null : "h-0 overflow-y-hidden")} 
        style={style}
        draggable
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        onDragOver={allowDrop}
        onDragEnter={markAsDropInsideTarget}
        onDragLeave={unmarkAsDropInsideTarget}
        onDrop={dropInside}
        onContextMenu={showContextMenu}
      > 
        <button 
          className={c("flex-none mx-2", {"invisible": childFolders.length === 0})} 
          onClick={expandToggle}
          onDragOver={expand}
          id={node.id}
        >
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>

        <button  
          onClick={select}
        >
          <FolderIcon />{' '}
          <span style={{
            ...(isDropInsideTarget ? {backgroundColor: "-moz-menuhover"} : {})
          }}>
            {node.title}
          </span> 
        </button>
      </div>
      
      {!(childFolders.length > 0 && isExpanded) && isVisible && 
        <MoveIndicator level={level} onDrop={dropAfter}  />}

      {childFolders.map((child, index) =>
        <TreePaneFolder 
          key={child.id}
          node={child}
          nodePath={[...nodePath, child.id]}
          level={level+1} 
          index={index}
          isVisible={isExpanded}
          currentFolder={currentFolder} 
          expandedFolders={expandedFolders}
          onSelect={onSelect}
          onExpandChange={onExpandChange}
          onDragStart={onDragStart}
          onDropInside={onDropInside}
          onDropBefore={onDropBefore}
          onDropAfter={onDropAfter}
          onDelete={onDelete}
          onMove={onMove} />)}
    </>
  )
}