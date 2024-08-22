import { Action, ActionPanel, Form, showToast, Toast, useNavigation } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import fs from "fs";
import { BookmarkInfo, BookmarkInput, BookmarkFile, Filter } from "../types";

export default function EditForm(props: { file: BookmarkFile; onReload: () => void }) {
  const { pop } = useNavigation();

  const { handleSubmit, itemProps } = useForm<BookmarkInput>({
    onSubmit(values) {
      const bookmarkInfo: BookmarkInfo = {
        name: values.name,
        description: values.description,
        url: values.url,
        tags: values.tagStrings
          .split(",")
          .filter((tag) => tag)
          .map((tag) => tag.toLowerCase().trim()),
        status: values.status,
      };
      const filePath = props.file.filePath;
      const jsonString = JSON.stringify(bookmarkInfo, null, 2);
      fs.writeFile(filePath, jsonString, "utf8", (err) => {
        if (err) {
          showToast({
            style: Toast.Style.Failure,
            title: "An error occurred",
            message: err.message,
          });
        } else {
          showToast({
            style: Toast.Style.Success,
            title: "Successfully updated",
            message: props.file.fileName,
          });
          props.onReload();
          pop();
        }
      });
    },
    initialValues: {
      name: props.file.bookmarkInfo.name || "",
      url: props.file.bookmarkInfo.url || "",
      tagStrings: props.file.bookmarkInfo.tags.join(",") || "",
      description: props.file.bookmarkInfo.description || "",
    },
    validation: {
      name: FormValidation.Required,
      url: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Name" placeholder="Gitコマンド集" {...itemProps.name} />
      <Form.TextField title="URL" placeholder="url" {...itemProps.url} />
      <Form.TextField title="Tags" placeholder="tips,git" {...itemProps.tagStrings} />
      <Form.TextField title="Description" placeholder="Gitでよく使うコマンド" {...itemProps.description} />
      <Form.Dropdown id="status" title="Status" defaultValue={Filter.All}>
        <Form.Dropdown.Item value={Filter.All} title="ALL" key={Filter.All} />
        <Form.Dropdown.Item value={Filter.Archived} title="ARCHIVED" key={Filter.Archived} />
      </Form.Dropdown>
    </Form>
  );
}
