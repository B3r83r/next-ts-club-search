import type { ClubLocation } from '@/types/club-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Image from 'next/image';

type ClubListProps = {
	locations: ClubLocation[];
};

export default function ClubList({ locations }: ClubListProps) {
	return (
		<div className="accordion-list">
			<h4>Folgende Vereine wurden gefunden:</h4>
			{locations.map(({ id, title, acf }) => (
				<Accordion key={id}>
					<AccordionSummary id="panel-header" aria-controls="panel-content">
						{title.rendered}
					</AccordionSummary>
					<Image
						alt={title.rendered}
						className="club-emblem"
						src={acf.club_emblem}
						width="64"
						height="64"
						loading="lazy"
					/>
					<AccordionDetails></AccordionDetails>
				</Accordion>
			))}
		</div>
	);
}
