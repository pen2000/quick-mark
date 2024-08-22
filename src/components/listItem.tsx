import { List, Color } from "@raycast/api";
import { BookmarkFile } from "../types";
import ListActions from "./listActions";
import { getFavicon } from "@raycast/utils";

export default function ListItem(file: BookmarkFile, onReload: () => void) {
  return (
    <List.Item
      key={file.filePath}
      icon={getFavicon(file.bookmarkInfo.url)}
      title={file.bookmarkInfo.name}
      subtitle={file.bookmarkInfo.description}
      keywords={[file.bookmarkInfo.description]}
      accessories={file.bookmarkInfo.tags.map((tagName) => {
        return { tag: { value: tagName, color: Color.Yellow } };
      })}
      actions={ListActions(file, onReload)}
    />
  );
}
