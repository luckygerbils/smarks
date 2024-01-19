export function findNode(tree: browser.bookmarks.BookmarkTreeNode, path: string[]): browser.bookmarks.BookmarkTreeNode { 
  return path.length === 0 ? tree : findNode((tree.children ?? []).find(({id}) => id === path[0]), path.slice(1));
}