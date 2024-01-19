export function byIndex(
    a: browser.bookmarks.BookmarkTreeNode, b: browser.bookmarks.BookmarkTreeNode
) {
  return a.index - b.index;
}