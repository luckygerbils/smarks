import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

interface EditPaneProps {
  node: browser.bookmarks.BookmarkTreeNode,
  onChange: (node: browser.bookmarks.BookmarkTreeNode, changes: {title?: string, url?: string}) => any,
}

export function EditPane({
  node,
  onChange,
} : EditPaneProps) {
  const [title, setTitle] = useState(node.title);
  const [url, setUrl] = useState(node.url);

  const updateTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onChange(node, {title: e.target.value});
  }, [node, onChange]);
  const updateUrl = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    onChange(node, {url: e.target.value});
  }, [node, onChange]);

  const prevNode = useRef(node);
  useEffect(() => {
    if (prevNode.current !== node) {
      setTitle(node.title);
      setUrl(node.url);
      prevNode.current = node;
    }
  }, [node])

  if (node == null) {
    return null;
  }

  return (
    <div className="bg-zinc-100 px-4 py-2" style={{minHeight: "10em"}}>
      {node.type == "folder" ? 
          <>
            <label className="block">Name</label>
            <input className="w-full" value={title||""} onChange={updateTitle} />
          </> :
          <>
            <label className="block">Name</label>
            <input className="w-full" value={title||""} onChange={updateTitle} />
            <label className="block">URL</label>
            <input className="w-full" value={url||""} onChange={updateUrl} />
          </>}
    </div>
  );
}