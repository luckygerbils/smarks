import React, { useCallback, useEffect, useMemo, useState, MouseEvent } from "react";
import { MoveIndicator } from ".";
import c from "classnames";
import { FolderIcon } from "./icons/Folder";
import { bookmarkContextMenu } from "../helpers/bookmarkContextMenu";
import { folderContextMenu } from "../helpers/folderContextMenu";

interface FolderPaneRowProps {
  node: browser.bookmarks.BookmarkTreeNode,
  nodePath: string[],
  isSelected: boolean,
  onSelect: (nodeId: string) => any,
  onDoubleClick: (node: browser.bookmarks.BookmarkTreeNode, nodePath: string[]) => any,
  onDragStart: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onDropInside: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onDropBefore: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onDropAfter: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onDelete: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onMove: (folder: string, newParentFolderId?: string, newIndex?: number) => any,
}

export function FolderPaneRow({ 
  node, 
  nodePath,
  isSelected,
  onSelect,
  onDoubleClick,
  onDragStart,
  onDropInside,
  onDropBefore,
  onDropAfter,
  onDelete,
  onMove,
}: FolderPaneRowProps) {
  const isFolder = node.url == null;

  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [isDropInsideTarget, setIsDropInsideTarget] = useState(false);

  const showContextMenu = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    if (node.url != null) {
      bookmarkContextMenu({ node, onDelete });
    } else {
      folderContextMenu({ node, onDelete, onMove })
    }
  }, [node, onDelete, onMove]);

  const dragStart = useCallback(() => {
    setIsBeingDragged(true);
    onDragStart(node);
  }, [setIsBeingDragged, onDragStart, node]);
  const dragEnd = useCallback(() => {
    setIsBeingDragged(false);
  }, [setIsBeingDragged]);

  const allowDrop = useCallback((event: MouseEvent) => event.preventDefault(), []);
  const dropInside = useCallback((e: MouseEvent) => {
    e.preventDefault(); // Prevent drop of link from navigating
    setIsDropInsideTarget(false);
    onDropInside(node);
  }, [onDropInside, node]);

  const select = useCallback((e: MouseEvent<HTMLAnchorElement|HTMLButtonElement>) => {
    if (!e.ctrlKey) {
      e.preventDefault();
    }
    onSelect(node.id)
  }, [onSelect, node.id]);
  const dropBefore = useCallback(() => { onDropBefore(node); }, [onDropBefore, node])
  const dropAfter = useCallback(() => { onDropAfter(node); }, [onDropAfter, node])

  const markAsDropInsideTarget = useCallback(() => setIsDropInsideTarget(true), []);
  const unmarkAsDropInsideTarget = useCallback(() => setIsDropInsideTarget(false), []);
  const handleDoubleClick = useCallback(() => onDoubleClick(node, nodePath), [onDoubleClick, node, nodePath]);

  const icon = (
    <span className="flex-none py-0.5 pl-4 pr-2 flex items-center">
      {isFolder ? <FolderIcon /> : <img style={{width: "15px", height: "15px"}} src={`https://icons.duckduckgo.com/ip3/${new URL(node.url).hostname}.ico`} />}
    </span>
  );

  const nodeTitle = (
    <span className="py-0.5 whitespace-nowrap text-ellipsis overflow-hidden">
      {node.title}
    </span>
  );

  const className = "flex flex-row";
  const Element = isFolder ? "button" : "a";
  const elementProps = {
    ...(isFolder ? {
      onDragEnter: markAsDropInsideTarget,
      onDragLeave: unmarkAsDropInsideTarget,
      onDoubleClick: handleDoubleClick,
    } : { 
      href: node.url,
      onDoubleClick: handleDoubleClick,
    }),
  };

  const style = {
    marginTop: "-0.4rem",
    marginBottom: "-0.1rem",
    ...(isSelected && !isBeingDragged ? {backgroundColor: "-moz-menuhover"} : {}),
    ...(isSelected && !isBeingDragged ? {color: "white"} : {}),
  };

  return (
    <div onContextMenu={showContextMenu}>
      {node.index === 0 && 
        <MoveIndicator onDrop={dropBefore} />}
      <Element 
        className={c(className, "select-none", "flex", "items-center", "w-full")} 
        style={style}
        draggable 
        onClick={select}
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        onDragOver={allowDrop}
        onDrop={dropInside}
        {...elementProps}
      >
        {icon}
        {nodeTitle}
        <span className="grow text-right text-gray-300">
          {node.index}
        </span>
      </Element>
      <MoveIndicator onDrop={dropAfter} />
    </div>
  )
}