
import ProfileDiscord from "~/app/_components/Profile";
import VolunteerApplication from "~/app/_components/VolunteerApplication";

export default async function Profile() {
	return (
		<div className="tw-m-4 tw-gap-2 tw-flex tw-flex-col ">
			<ProfileDiscord />
			<VolunteerApplication />
		</div>
	);
}




