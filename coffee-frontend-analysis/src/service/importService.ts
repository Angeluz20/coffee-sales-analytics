import { api } from "./api";

export async function importFile(userId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file); 

  const { data } = await api.post(`/file-imports/import/userId/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(data)
  return data;
}

export async function getFileData(userId: number) {
  const { data } = await api.get(`file-imports/userId/${userId}`);
  return data;
}

export async function removeFile(id: number) {
  const { data } = await api.delete(`file-imports/${id}`);
  return data;
}