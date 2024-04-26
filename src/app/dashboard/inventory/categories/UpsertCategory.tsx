"use client";

import { Button, Form, type FormProps, Input, Select } from "antd";

import { api } from "~/trpc/react";

type FormUpsert = {
  id?: string;
  name: string;
  parentId: string;
};

export function UpsertCategory() {
  const utils = api.useUtils();
  const categories = api.category.list.useQuery();
  const upsertCategory = api.category.upsert.useMutation({
    onMutate() {
      form.resetFields();
    },
    async onSuccess() {
      await utils.category.list.refetch();
    },
  });
  const [form] = Form.useForm();
  const onFinish: FormProps<FormUpsert>["onFinish"] = (values) => {
    void upsertCategory.mutateAsync({
      id: values.id,
      name: values.name,
      parentId: values.parentId,
    });
  };
  return (
    <div className="tw-rounded-lg tw-border-[1px] tw-border-gray-200 tw-p-2">
      <Form onFinish={onFinish} labelCol={{ span: 4 }} form={form}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: "Por favor, ingrese un nombre" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="parentId" label="Padre">
          <Select
            style={{ width: "100%" }}
            options={categories.data?.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
        </Form.Item>
        <div className="tw-flex">
          <Button htmlType="submit" className="tw-ml-auto" type="primary">
            Guardar
          </Button>
        </div>
      </Form>
    </div>
  );
}
