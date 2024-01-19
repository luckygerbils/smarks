import React from "react";
import { createRoot } from 'react-dom/client';
import { Page } from "./components";

const [tree, state] = await Promise.all([
    browser.bookmarks.getTree(),
    browser.storage.local.get(["expandedFolders", "currentFolderPath", "selectedNodeId"]),
]);

const { expandedFolders, currentFolderPath, selectedNodeId } = state;
const root = createRoot(document.getElementById("page"));
root.render(
    <Page defaultRoot={tree[0]} 
        defaultExpandedFolders={expandedFolders} 
        defaultCurrentFolderPath={currentFolderPath}
        selectedNodeId={selectedNodeId} />);