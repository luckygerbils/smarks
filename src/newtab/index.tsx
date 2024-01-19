import React from "react";
import ReactDOM from "react-dom";
import { Page } from "./components";

const [tree, state] = await Promise.all([
    browser.bookmarks.getTree(),
    browser.storage.local.get(["expandedFolders", "currentFolderPath", "selectedNodeId"]),
]);

const { expandedFolders, currentFolderPath, selectedNodeId } = state;
ReactDOM.render(
    <Page defaultRoot={tree[0]} 
        defaultExpandedFolders={expandedFolders} 
        defaultCurrentFolderPath={currentFolderPath}
        selectedNodeId={selectedNodeId} />, 
    document.getElementById("page"));