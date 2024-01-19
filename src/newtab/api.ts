export async function moveBookmark(bookmarkId: string, targetFolderId?: string, newIndex?: number) {
  console.log("Move", bookmarkId, "to", targetFolderId, "index", newIndex)
  return await browser.bookmarks.move(bookmarkId, { parentId: targetFolderId, index: newIndex });
}

export async function getBookmarksTree() {
  return (await browser.bookmarks.getTree())[0];
}

export async function removeBookmark(bookmarkId: string) {
  return browser.bookmarks.remove(bookmarkId);
}

export async function updateBookmark(bookmarkId: string, changes: {title?: string, url?: string}) {
  return browser.bookmarks.update(bookmarkId, changes);
}

export async function removeTree(folderId: string) {
  return browser.bookmarks.removeTree(folderId);
}