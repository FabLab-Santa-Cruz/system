"use client";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, type UploadFile, Button } from "antd";
import { type RcFile } from "antd/es/upload";
import axios, { type AxiosRequestConfig } from "axios";
import { type PostPolicyResult } from "minio";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useGlobalContext } from "../state/globalContext";

/**
 * Solo emite url del archivo al terminar el upload.
 */
export default function SimpleUpload({
  children,
  maxItems = 1,
  maxSizeMB = 5,
  isPublic = true,
  onFinish,
}: {
  children?: React.ReactNode;
  maxItems?: number;
    isPublic?: boolean;
  maxSizeMB?: number;
  onFinish?: (value: string) => void;
}) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const uapi = api.upload.getUrl.useMutation();
  const context = useGlobalContext()
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState<number | null>(null);
  return (
    <Upload
      
      onRemove={(e) => setFileList(fileList.filter((f) => f.uid !== e.uid))}
      fileList={fileList}
      customRequest={async (options) => {
        const { onSuccess, onError, onProgress } = options;
        const fileOptions = options.file as unknown as UploadFile;
        // Check if the file is more than maxsizer
        if (fileOptions.size && fileOptions.size / 1024 / 1024 > maxSizeMB) {
          void context?.messageApi.error(`El archivo es demasiado grande Maximo: ${maxSizeMB}MB`);
          return;
        }

        const data = await uapi.mutateAsync({
          maxSize: maxSizeMB * 1024 * 1024,
          objectName: fileOptions.name,
          contentType: fileOptions.type,
          isPublic,
        });

        setLoading(true);
        customUpload({
          file: options.file,
          minioInstance: data,
          extraAxiosConfig: {
            onUploadProgress: (progressEvent) => {
              const total = progressEvent.total ?? 1;
              onProgress?.({
                percent: Math.round((progressEvent.loaded * 100) / total ?? 1),
              });
              setPercent(Math.round((progressEvent.loaded * 100) / total ?? 1));
            },
          },
        })
          .then(() => {
            setLoading(false);
            setPercent(null);
            onSuccess?.(data.formData.key);
            onFinish?.(data.formData.key as string);
          })
          .catch((err) => {
            setLoading(false);
            setPercent(null);
            console.error(err);
            const error = new Error("Error uploading file");
            onError?.(error);
          });
      }}
    >
      {children ??
        (fileList.length < maxItems && (
          <Button loading={uapi.isPending || loading} icon={<UploadOutlined />}>
            Seleccion un archivo
            {percent && ` (${percent}%)`}
          </Button>
        ))}
    </Upload>
  );
}

export async function customUpload({
  file,
  minioInstance,
  extraAxiosConfig = {},
}: {
  file: string | Blob | RcFile;
  minioInstance: PostPolicyResult;
  extraAxiosConfig?: AxiosRequestConfig;
}) {
  const formData = new FormData();
  for (const key in minioInstance.formData) {
    formData.append(key, minioInstance.formData[key] as string);
  }
  formData.append("file", file);
  await axios.post(minioInstance.postURL, formData, extraAxiosConfig);
}
