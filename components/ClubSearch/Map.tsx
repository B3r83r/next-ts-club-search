'use client';

import type { ClubLocation, LatLng } from '@/types/club-types';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// @ts-ignore
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';

type Props = {
	zoom: number;
	coords: LatLng;
	locations?: ClubLocation[];
};

const MapController = ({ zoom, coords }: Props) => {
	const map = useMap();

	useEffect(() => {
		map.setView(coords, zoom);
	}, [zoom, coords, map]);

	return null;
};

/* const MapPlaceholder = () => {
	return (
		<p>
			Sie müssen die Datenschutzbestimmungen akzeptieren, um die Karte anzeigen
			zu können
		</p>
	);
}; */

export default function Map({ zoom, coords, locations = [] }: Props) {
	return (
		<MapContainer
			zoom={zoom}
			center={coords}
			scrollWheelZoom={false}
			// placeholder={<MapPlaceholder />}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<MarkerClusterGroup>
				{locations.map(({ id, title, acf }) => (
					<Marker key={id} position={[acf.latitude, acf.longitude]}>
						<Popup>
							<strong>{title.rendered}</strong>
						</Popup>
					</Marker>
				))}
			</MarkerClusterGroup>
			<MapController zoom={zoom} coords={coords} />
		</MapContainer>
	);
}
