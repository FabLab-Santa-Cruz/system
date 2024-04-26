"use client";
import { CiPen } from "react-icons/ci";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  Typography,
  type Tree,
} from "antd";
import { type ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { UpsertCategory } from "./UpsertCategory";
import { useEffect, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Tree = {
  title: string;
  key: string | null;
  data: Category | null;
  children?: Tree[];
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

type Category = RouterOutputs["category"]["list"][0];
export default function CategoriesPage() {
  const categories = api.category.list.useQuery();
  const upsertCategory = api.category.upsert.useMutation({
    async onSuccess() {
      await categories.refetch();
    },
  });
  const changeParent = api.category.changeParent.useMutation({
    async onSuccess() {
      await categories.refetch();
    },
  });
  const deleteCategory = api.category.delete.useMutation({
    async onSuccess() {
      await categories.refetch();
    },
  });

  const sortTree = (tree: Category[]) => {
    //Avoid mutating the original array
    const copyTree = [...tree];
    const newTree = new Map<string, Tree>();
    //Populate the object
    copyTree.forEach((category) => {
      newTree.set(category.id, {
        title: category.name,
        data: category,
        key: category.id,
      });
    });
    //Iterate in reverse to create the tree
    const reversed = copyTree.reverse();
    reversed.forEach((category) => {
      const node = newTree.get(category.id);
      if (!node) return;
      if (category.parentId) {
        const parent = newTree.get(category.parentId); //Reference to the parent must update and not create a

        if (parent) {
          if (parent.children) {
            parent.children.push(node);
          } else {
            parent.children = [node];
          }
          newTree.delete(node.key!);
        }
      }
    });
    return [
      {
        title: "Categorías (Raiz)",
        key: "root",
        data: null,
        children: Array.from(newTree.values()),
      },
    ];
  };

  const columns: ColumnProps<Tree>[] = [
    {
      title: "Nombre",
      key: "name",
      render: (_: unknown, category: Tree) => category.title,
    },
    {
      title: "Creado",
      key: "createdAt",
      render: (_: unknown, category: Tree) => {
        if (!category.data) return null;
        return dayjs(category.data?.createdAt).format("DD/MM/YYYY");
      },
    },
    {
      title: "Actualizado",
      key: "updatedAt",
      render: (_: unknown, category: Tree) => {
        if (!category.data) return null;
        return dayjs(category.data?.updatedAt).format("DD/MM/YYYY");
      },
    },
    {
      width: 100,
      title: "Acciones",
      key: "actions",
      render: (_: unknown, category: Tree) => {
        if (category.key === "root") return null;
        return (
          <>
            {!category.children && (
              <Popconfirm
                title="¿Quieres borrar esta categoría?"
                onConfirm={() => {
                  if (category.key) deleteCategory.mutate({ id: category.key });
                }}
              >
                <Button danger icon={<MdDelete />} />
              </Popconfirm>
            )}
            <Tooltip title="Editar categoría">
              <Button
                onClick={() => setSelectedCategory(category.data)}
                icon={<CiPen />}
              />
            </Tooltip>
          </>
        );
      },
    },
    {
      key: "sort",
      width: 50,
    },
  ];
  const [selectedCategory, setSelectedCategory] = useState<null | Category>(
    null,
  );

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  useEffect(() => {
    if (categories.data) {
      setExpandedKeys([
        ...categories.data.map((category) => category.id),
        "root",
      ]);
    }
  }, [categories.data]);
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setDragging({ from: null, to: null });
    if (active.id === over?.id) return;
    if (active?.id === "root") return;
    const toDestination = over?.id === "root" ? null : (over?.id as string);
    changeParent.mutate({
      id: active.id as string,
      parentId: toDestination,
    });
  };
  const [dragging, setDragging] = useState<{
    from?: Category | null;
    to?: Category | null;
  }>({
    from: null,
    to: null,
  });

  return (
    <div className="tw-m-2 tw-flex tw-w-full tw-gap-2">
      <Modal
        open={!!selectedCategory}
        onCancel={() => setSelectedCategory(null)}
        footer={null}
        title={`Editar categoría ${selectedCategory?.name ?? ""} `}
        width={800}
        destroyOnClose
      >
        <Form
          onFinish={({ id, name, parentId }: Category) => {
            void upsertCategory.mutateAsync({
              id: id,
              name,
              parentId,
            });
            setSelectedCategory(null);
          }}
          initialValues={selectedCategory!}
          labelCol={{ span: 4 }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nombre"
            rules={[
              { required: true, message: "Por favor, ingrese un nombre" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="parentId" label="Categoría padre">
            <Select
              placeholder="Categoría padre"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                categories.data
                  ? [
                      ...categories.data.map((category) => ({
                        value: category.id,
                        label: category.name,
                      })),
                      { value: null, label: "Categoría raiz" },
                    ]
                  : []
              }
            />
          </Form.Item>
          <div className="tw-flex">
            <Button className="tw-ml-auto" htmlType="submit" type="primary">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal>
      <div className="tw-basis-1/2">
        <Divider>
          <Typography.Title level={5}>Categorías</Typography.Title>
        </Divider>
        <DndContext
          //modifiers={[restrictToVerticalAxis]}
          onDragMove={({ active, over }) => {
            const to =
              over?.id === "root"
                ? ({
                    id: "root",
                    name: "Categoría raiz",
                    parentId: null,
                  } as Category)
                : categories.data?.find((i) => i.id === (over?.id as string));
            setDragging({
              from: categories.data?.find(
                (i) => i.id === (active.id as string),
              ),
              to,
            });
          }}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={categories.data?.map((i) => i.id) ?? []}
            strategy={verticalListSortingStrategy}
          >
            <Table
              expandable={{
                defaultExpandAllRows: true,
                expandedRowKeys: expandedKeys,
                onExpand(expanded, record) {
                  if (expanded) {
                    setExpandedKeys([...expandedKeys, record.key!]);
                  } else {
                    setExpandedKeys(
                      expandedKeys.filter((key) => key !== record.key),
                    );
                  }
                },
              }}
              components={{
                body: {
                  row: Row,
                },
              }}
              loading={categories.isLoading || changeParent.isPending}
              columns={columns}
              dataSource={sortTree(categories.data ?? [])}
            />
          </SortableContext>
        </DndContext>
        {/* Dragging from to */}
        <div>
          {dragging.from && (
            <Typography.Text>Desde: {dragging.from.name}</Typography.Text>
          )}
          {dragging.to && (
            <Typography.Text> Hacia:{dragging.to.name}</Typography.Text>
          )}
        </div>
      </div>
      <div className="tw-basis-1/2">
        <Divider>
          <Typography.Title level={5}>Insertar Categoria</Typography.Title>
        </Divider>
        <UpsertCategory />
      </div>
    </div>
  );
}
import { Children, cloneElement } from "react";
const Row = (data: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    //id: props["data-row-key"],
    id: data["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...data.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging
      ? {
          opacity: 0.5,
          position: "relative",
          zIndex: 9999,
        }
      : {
          opacity: 1,
        }),
  };

  return (
    <tr {...data} ref={setNodeRef} style={style} {...attributes}>
      {Children.map(data.children, (child) => {
        if ((child as React.ReactElement).key === "sort") {
          return cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move" }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};
