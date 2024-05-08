import ClubSearch from '@/components/ClubSearch/ClubSearch';
import type { ClubLocation } from '@/types/club-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Vereinssuche',
};

const WP_REST_URL = process.env.WP_REST_URL;

export default async function ClubsPage() {
	const request = await fetch(
		`${WP_REST_URL}/clubs?acf_format=standard&_fields=id,title,acf`,
		{
			next: {
				revalidate: 500,
			},
		},
	);

	const allClubs = (await request.json()) as ClubLocation[];
	console.log(allClubs);

	return (
		<main className="default-layout">
			<h1>Vereinssuche</h1>
			<h3>Auf der Suche nach einem Sportangebot?</h3>
			<p>
				Egal ob Kinderturnen, Gerätturnen, Turnspiele, Fitness- oder
				Gesundheitssport: Diese Vereinssuche findet passende Turn- und
				Sportvereine in deiner Nähe!
			</p>
			<ClubSearch locations={allClubs} />
		</main>
	);
}
