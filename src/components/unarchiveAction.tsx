import { Action, Alert, confirmAlert, Icon, showToast, Toast } from "@raycast/api";
import { BookmarkFile, Filter } from "../types";
import fs from "fs";

export default function UnarchiveAction(props: { file: BookmarkFile; onReload: () => void }) {
  const options: Alert.Options = {
    icon: Icon.Undo,
    title: "Do you want to unarchive it?",
    message: "Items that have been unarchived can be viewed by selecting the 'ALL' filter.",
    primaryAction: {
      title: "Unarchive",
      style: Alert.ActionStyle.Default,
      onAction: () => {
        const bookmarkInfo = props.file.bookmarkInfo;
        bookmarkInfo.status = Filter.All;
        const jsonString = JSON.stringify(bookmarkInfo, null, 2);
        fs.writeFile(props.file.filePath, jsonString, "utf8", (err) => {
          if (err) {
            showToast({
              style: Toast.Style.Failure,
              title: "An error occurred",
              message: err.message,
            });
          } else {
            showToast({
              style: Toast.Style.Success,
              title: "Successfully",
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
  const archiveAction = async () => {
    await confirmAlert(options);
  };

  return <Action title="Unarchive" icon={{ source: Icon.Undo }} onAction={() => archiveAction()} />;
}
