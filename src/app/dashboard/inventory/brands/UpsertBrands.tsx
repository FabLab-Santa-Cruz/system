"use client";
import { Button, Form, type FormProps, Input } from "antd";
import {
  type BasicUpload,
  UploadWithCrop,
} from "~/app/_components/UploadWithCrop";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";

type FBrand = {
  id?: string;
  name: string;
  image: BasicUpload[];
};
type Brand = RouterOutputs["brand"]["list"][0];

export default function UpsertBrands({
  brand,
  successCallback,
}: {
  brand?: Brand | null;
  successCallback?: () => void;
}) {
  const utils = api.useUtils();
  const upsertBrand = api.brand.upsert.useMutation({
    async onMutate() {
      if (successCallback) {
        successCallback();
      }
    },
    async onSuccess() {
      await utils.brand.list.refetch();
    },
  });
  const onFinish: FormProps<FBrand>["onFinish"] = (values) => {
    form.resetFields();
    void upsertBrand.mutateAsync({
      id: values.id,
      name: values.name,
      image: values.image[0]?.key,
    });
  };
  const defaultValue: FBrand = {
    id: "",
    name: "",
    image: [],
  };
  if (brand) {
    defaultValue.id = brand.id;
    defaultValue.name = brand.name;
    if (brand.image) {
      defaultValue.image = [
        {
          id: brand.id,
          key: brand.image ?? "",
        },
      ];
    }
  }
  const [form] = Form.useForm<FBrand>();
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="tw-m-2 tw-rounded-lg tw-border-[1px] tw-p-2">
        <Form
          initialValues={defaultValue}
          labelCol={{ span: 8 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Nombre"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre de la marca",
              },
            ]}
          >
            <Input
              placeholder="Nombre de la marca"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  return;
                }
              }}
            />
          </Form.Item>
          <Form.Item label="Imagen" name="image">
            <UploadWithCrop isPublic={true} />
          </Form.Item>
          <div className="tw-flex">
            <Button
              htmlType="submit"
              type="primary"
              className="tw-ml-auto"
              loading={upsertBrand.isPending}
            >
              {brand ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
