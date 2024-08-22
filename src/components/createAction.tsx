import { Action, Icon } from "@raycast/api";
import CreateForm from "./createForm";

export default function CreateAction(props: { onReload: () => void }) {
  return (
    <Action.Push
      icon={Icon.Plus}
      title="Add Bookmark"
      shortcut={{ modifiers: ["cmd"], key: "n" }}
      target={<CreateForm onReload={props.onReload} />}
    />
  );
}
