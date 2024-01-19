interface BookmarkContextMenuProps {
  node: browser.bookmarks.BookmarkTreeNode,
  onDelete: (node: browser.bookmarks.BookmarkTreeNode) => any,
}
export function bookmarkContextMenu({
  node,
  onDelete,
}: BookmarkContextMenuProps) {
  browser.menus.removeAll();
  browser.menus.create({ title: "&Open", onclick: () => { document.location = node.url; } });
  browser.menus.create({ title: "Open in Ne&w Tab", onclick: () => { browser.tabs.create({ url: node.url }); }});
  browser.menus.create({ title: "Open in &New Window", onclick: () => { browser.windows.create({ url: node.url }); }});
  const openInPrivateWindow = browser.menus.create({ title: "Open in New &Private Window", enabled: false, onclick: async () => { 
    browser.windows.create({ url: node.url, incognito: true });
  }});
  browser.extension.isAllowedIncognitoAccess().then(enabled => browser.menus.update(openInPrivateWindow, { enabled: enabled }))
  browser.menus.create({ type: "separator", });
  browser.menus.create({ title: "&Delete Bookmark", onclick: () => onDelete(node) });
  browser.menus.create({ type: "separator", });
  browser.menus.create({ title: "Cu&t", });
  browser.menus.create({ title: "&Copy", });
  browser.menus.create({ title: "&Paste", });
  browser.menus.create({ type: "separator", });
  browser.menus.create({ title: "Add &Bookmark", });
  browser.menus.create({ title: "Add &Folder", });
  browser.menus.create({ title: "Add &Separator", });
  browser.menus.overrideContext({
    showDefaults: false
  });
}