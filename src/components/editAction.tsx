import { Action, Icon } from "@raycast/api";
import EditForm from "./editForm";
import { BookmarkFile } from "../types";

export default function EditAction(props: { file: BookmarkFile; onReload: () => void }) {
  return (
    <Action.Push
      icon={{ source: Icon.Pencil }}
      title="Edit"
      shortcut={{ modifiers: ["cmd"], key: "e" }}
      target={<EditForm file={props.file} onReload={props.onReload} />}
    />
  );
}
