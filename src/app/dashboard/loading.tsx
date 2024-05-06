import { Spin } from "antd";

export default function LoadingDashboard() {
	return (
		<div className="tw-w-full tw-h-screen tw-flex tw-justify-center tw-items-center">
			<Spin size="large" />;
		</div>
	);
}