export type LatLng = {
	lat: number;
	lng: number;
};

export type ClubLocation = {
	id: number;
	title: { rendered: string };
	acf: {
		club_emblem: string;
		latitude: number;
		longitude: number;
	};
};

export type Proposal = {
	country_code: string;
	zipcode: string;
	place: string;
	state: string;
	state_code: string;
	province: string;
	province_code: string;
	community: string;
	community_code: string;
	latitude: string;
	longitude: string;
};
