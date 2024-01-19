export function byTitle(
    a: browser.bookmarks.BookmarkTreeNode, b: browser.bookmarks.BookmarkTreeNode
) {
  return a.title.localeCompare(b.title);
}