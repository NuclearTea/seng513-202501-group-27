import { FileServiceClient } from "../proto/filetree/FiletreeServiceClientPb";
import { UploadRequest, Directory } from "../proto/filetree/filetree_pb";

const client = new FileServiceClient("http://localhost:8081", null, null);

const directory = new Directory();
directory.setName("root");

// create and set files/children as needed...

const request = new UploadRequest();
request.setRoot(directory);

client.upload(request, {}, (err, response) => {
  if (err) {
    console.error("Upload error", err.message);
  } else {
    console.log("Upload response:", response.getStatus());
  }
});
