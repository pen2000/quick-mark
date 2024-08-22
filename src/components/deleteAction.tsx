import { Action, Alert, confirmAlert, Icon, showToast, Toast } from "@raycast/api";
import { BookmarkFile } from "../types";
import fs from "fs";

export default function DeleteAction(props: { file: BookmarkFile; onReload: () => void }) {
  const options: Alert.Options = {
    title: "Delete the file?",
    message: "You will not be able to recover it",
    primaryAction: {
      title: "Delete",
      style: Alert.ActionStyle.Destructive,
      onAction: () => {
        fs.unlink(props.file.filePath, (err) => {
          if (err) {
            showToast({
              style: Toast.Style.Failure,
              title: "An error occurred",
              message: err.message,
            });
          } else {
            showToast({
              style: Toast.Style.Success,
              title: "Successfully deleted",
              message: props.file.fileName,
            });
            props.onReload();
          }
        });
      },
    },
    dismissAction: {
      title: "Cancel",
      style: Alert.ActionStyle.Cancel,
    },
  };
  const deleteAction = async () => {
    await confirmAlert(options);
  };

  return (
    <Action
      title="Delete"
      icon={{ source: Icon.Trash }}
      onAction={() => deleteAction()}
      shortcut={{ modifiers: ["cmd"], key: "x" }}
    />
  );
}
