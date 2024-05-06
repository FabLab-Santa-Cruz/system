import { Button, Form, Input, Space } from "antd";
import { type FormListProps } from "antd/es/form";

export type BasicMultiInput = {
	id?: string; // for editing
	property: string;
	deleteable?: boolean;
};

export default function MultipleInput({
	propertyTitle = "Property",
	formName = "properties",
	rules = [],
	value,
}: {
	value?: BasicMultiInput[];
	onChange?: (value: BasicMultiInput[]) => void;
	propertyTitle?: string;
	formName?: string;
	rules?: FormListProps["rules"];
}) {
	return (
		<Form.List name={formName} rules={rules}>
			{(fields, operation) => (
				<>
					{fields.map((props, idx) => {
						const deleteable = value?.[idx]?.deleteable;
						const evaluateDelete =
							deleteable !== undefined && deleteable === false;
						return (
							<Form.Item key={props.key}>
								<Space.Compact style={{ width: "100%" }}>
									<Form.Item
										{...props}
										name={[props.name, "property"]}
										key={props.key}
										noStyle
									>
										<Input
											disabled={evaluateDelete}
											placeholder={propertyTitle}
											// addonAfter={

											// }
										/>
									</Form.Item>
									<Button
										type="primary"
										disabled={evaluateDelete}
										danger
										onClick={() => operation.remove(props.name)}
									>
										Eliminar
									</Button>
								</Space.Compact>
								{/* Button remove */}
							</Form.Item>
						);
					})}
					<Form.Item>
						<Button
							type="dashed"
							onClick={() => {
								operation.add({
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