'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getDistance, getUserCoords } from '@/lib/helpers';
// import allClubs from '@/lib/clubLocations';
import ClubSearchForm from './ClubSearchForm';
import ClubList from './ClubList';

import type { ClubLocation, LatLng } from '@/types/club-types';
import Button from '@mui/material/Button';

type ClubSearchProps = {
	locations: ClubLocation[];
};
// Make sure Map is not rendered on server because of leaflet apis
const Map = dynamic(() => import('@/components/ClubSearch/Map'), {
	ssr: false,
});

// Default Coordinates - Center of Germany
const defaultCoords = { lat: 51.1864708, lng: 10.0671016 };
const defaultZoom = 6;

// Show surrounding Clubs
const showSurroundingClubs = async (
	setCoordsError: Dispatch<SetStateAction<string>>,
	setUserCoords: Dispatch<SetStateAction<LatLng | null>>,
) => {
	setCoordsError('');

	try {
		const coords = await getUserCoords();
		const userCoords = {
			lat: coords.coords.latitude,
			lng: coords.coords.longitude,
		};
		setUserCoords(userCoords);
	} catch (error) {
		if (!(error instanceof GeolocationPositionError)) return;

		switch (error.code) {
			case error.PERMISSION_DENIED:
				setCoordsError(
					'Sie müssen die Erlaubnis zur Standortermittlung erteilen.',
				);
				break;

			case error.POSITION_UNAVAILABLE:
				setCoordsError(
					'Ihr Standort konnte aus technischen Gründen nicht ermittelt werden.',
				);
				break;

			case error.TIMEOUT:
				setCoordsError('Die Standortermittlung dauerte zu lange.');
		}
	}
};

// Get Initial user coordinates from URL
const getInitialUserCoords = (searchParams: URLSearchParams) => {
	const lat = searchParams.get('lat');
	const lng = searchParams.get('lng');

	if (!lat || !lng) return null;

	return {
		lat: Number(lat),
		lng: Number(lng),
	};
};

// Get clubs in Radius
/* const getClubsInRadius = (coords: LatLng, radius = 10) => {
	const clonedClubs = structuredClone(allClubs);
	const clubsInRadius = clonedClubs.filter((club) => {
		const distance = getDistance(
			coords.lat,
			coords.lng,
			club.latLng.lat,
			club.latLng.lng,
		);

		club.distance = distance;

		return distance <= radius;
	});
	clubsInRadius.sort((a, b) => a.distance! - b.distance!);

	return clubsInRadius;
}; */

// MAIN FUNCTION
export default function ClubSearch({ locations }: ClubSearchProps) {
	const router = useRouter();
	const path = usePathname();
	const searchParams = useSearchParams();

	const [mapCoords, setMapCoords] = useState(defaultCoords);
	const [zoom, setZoom] = useState(defaultZoom);
	const [showMap, setShowMap] = useState(false);
	const [hasNavigator, setHasNavigator] = useState(false);
	const [coordsError, setCoordsError] = useState('');
	const [userCoords, setUserCoords] = useState(
		getInitialUserCoords(searchParams),
	);

	const reset = () => {
		setMapCoords(defaultCoords);
		setZoom(defaultZoom);
		setCoordsError('');
	};

	// const shownClubs = userCoords ? getClubsInRadius(userCoords) : clubs;

	useEffect(() => {
		setHasNavigator('geolocation' in window.navigator);
	}, []);

	useEffect(() => {
		userCoords
			? (setMapCoords(userCoords),
				setZoom(11),
				router.replace(`?lat=${userCoords.lat}&lng=${userCoords.lng}`))
			: (reset(), router.replace(path));
	}, [userCoords, path, router]);

	return (
		<section className="club-search">
			<ClubSearchForm setUserCoords={setUserCoords} />
			{hasNavigator && (
				<Button
					variant="outlined"
					onClick={() => showSurroundingClubs(setCoordsError, setUserCoords)}
				>
					Nur Vereine im Umkreis
				</Button>
			)}
			{coordsError && (
				<strong className="club-search__error">{coordsError}</strong>
			)}
			{showMap ? (
				<Map zoom={zoom} coords={mapCoords} locations={locations} />
			) : (
				<div className="club-search__show-map">
					<Button
						variant="contained"
						aria-describedby="map-privacy-info"
						onClick={() => setShowMap(true)}
					>
						Karte anzeigen
					</Button>
					<small id="map-privacy-info">
						Mit dem Anzeigen der Karte, stimmen Sie automatisch den
						Datenschutzerklärung zu.
					</small>
				</div>
			)}
			<ClubList locations={locations} />
			{locations.length === 0 && (
				<strong>Kein Verein in Ihrer Umgebung gefunden!</strong>
			)}
		</section>
	);
}
