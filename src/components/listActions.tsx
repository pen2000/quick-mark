import { ActionPanel, Action, Icon } from "@raycast/api";
import { BookmarkFile, Filter } from "../types";
import CreateAction from "./createAction";
import EditAction from "./editAction";
import DeleteAction from "./deleteAction";
import ArchiveAction from "./archiveAction";
import UnarchiveAction from "./unarchiveAction";

export default function ListActions(file: BookmarkFile, onReload: () => void) {
  return (
    <ActionPanel>
      <Action.OpenInBrowser title="Open" icon={{ source: Icon.Globe }} url={file.bookmarkInfo.url} />
      <ActionPanel.Submenu title="Action">
        <EditAction file={file} onReload={onReload} />
        {file.bookmarkInfo.status === Filter.All && <ArchiveAction file={file} onReload={onReload} />}
        {file.bookmarkInfo.status === Filter.Archived && <UnarchiveAction file={file} onReload={onReload} />}
        <DeleteAction file={file} onReload={onReload} />
      </ActionPanel.Submenu>
      <CreateAction onReload={onReload} />
    </ActionPanel>
  );
}
