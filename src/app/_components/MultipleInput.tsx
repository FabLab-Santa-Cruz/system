import { Button, Form, Input, Tag } from "antd";
import { FormListProps } from "antd/es/form";
import { useEffect, useState } from "react";

export type BasicMultiInput = {
	id?: string; // for editing
	property: string;
};

export default function MultipleInput({
	propertyTitle = "Property",
	formName = "properties",
	rules = [],
}: {
	value?: BasicMultiInput[];
	onChange?: (value: BasicMultiInput[]) => void;
	propertyTitle?: string;
	formName?: string;
	rules?: FormListProps["rules"];
}) {
	return (
		<Form.List name={formName} rules={rules}>
			{(fields, { add, remove }) => (
				<>
					{fields.map((props) => (
						<Form.Item
							{...props}
							name={[props.name, "property"]}
							key={props.key}
						>
							<Input
								placeholder={propertyTitle}
								addonAfter={
									<Button danger onClick={() => remove(props.name)}>
										Eliminar
									</Button>
								}
							/>
							{/* Button remove */}
						</Form.Item>
					))}
					<Form.Item>
						<Button
							type="dashed"
							onClick={() => {
								add({
									property: "",
								});
							}}
							style={{ width: "100%" }}
						>
							Añadir
						</Button>
					</Form.Item>
				</>
			)}
		</Form.List>
	);
}