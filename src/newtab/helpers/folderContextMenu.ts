import { byTitle } from ".";

interface FolderContextMenuProps {
  node: browser.bookmarks.BookmarkTreeNode,
  onDelete: (node: browser.bookmarks.BookmarkTreeNode) => any,
  onMove: (nodeId: string, newParentFolderId?: string, newIndex?: number) => any,
}
export function folderContextMenu({
  node,
  onDelete,
  onMove,
}: FolderContextMenuProps) {
  browser.menus.removeAll();
  browser.menus.create({ title: "&Open All Bookmarks", onclick: () => { 
    (node.children || [])
      .filter(child => child.url != null)
      .forEach(({url}) => browser.tabs.create({url}));
  } });
  browser.menus.create({ type: "separator", });
  browser.menus.create({ title: "&Delete Folder", onclick: () => {
    onDelete(node)
  } });
  browser.menus.create({ title: "So&rt By Name", onclick: async () => {
    const sortedChildren = Array.from(node.children || []).sort(byTitle);
    for (let i = 0; i < sortedChildren.length; i++) {
      await onMove(sortedChildren[i].id, node.id, i);
    }
  } });
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